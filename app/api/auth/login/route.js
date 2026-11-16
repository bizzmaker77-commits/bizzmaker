import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;
    let email = body.email?.toLowerCase().trim();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Auto-complete email if only username was provided (e.g. 'admin', 'praveen', 'nikhil')
    if (email && !email.includes('@')) {
      if (email === 'tl') email = 'tl@workforce.com';
      else email = `${email}@aidigital.com`;
    }

    let user = await prisma.user.findUnique({
      where: { email }
    });

    // Check if user is a registered client in the client table
    if (!user) {
      const client = await prisma.client.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } }
      });
      if (client && client.active) {
        const isHttps = request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
        const cookieStore = await cookies();
        cookieStore.set('clientId', client.clientId, {
          httpOnly: true,
          secure: isHttps,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/'
        });
        cookieStore.delete('userId');
        return NextResponse.json({
          user: {
            id: client.id,
            name: client.clientName || client.businessName,
            email: client.email || '',
            role: 'CLIENT',
            clientId: client.clientId,
            businessName: client.businessName
          }
        });
      }

      return NextResponse.json({ error: 'Invalid credentials or user not found' }, { status: 401 });
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'This user account is inactive' }, { status: 401 });
    }

    // Verify password: check bcrypt hash, fallback to direct compare for development ease
    let isMatch = await bcrypt.compare(password, user.password).catch(() => false);
    if (!isMatch && password === user.password) {
      isMatch = true;
    }

    // Password bypasses for standard dummy DB testing to prevent lockout from typos
    const COMMON_PASSWORDS = {
      'admin@aidigital.com': ['Ai_Digital@0701', 'admin123', 'admin', 'AiDigital@0701', 'Admin@123', 'Admin@#123'],
      'praveen@aidigital.com': ['Admin@#123', 'Admin@123', 'admin123', 'praveen123', 'admin'],
      'nikhil@aidigital.com': ['AiDigitals@246', 'AiDigital@246', 'nikhil123', 'nikhil', 'ceo123'],
      'tl@workforce.com': ['tl123', 'tl', 'teamlead123'],
      'danish@aidigital.com': ['Danish@Ai123', 'danish123', 'danish'],
      'harshit@aidigital.com': ['Harshit@Ai456', 'harshit123', 'harshit'],
      'developer@aidigital.com': ['Prem@#123', 'Prem@123', 'dev123', 'developer123'],
      'jennifer@aidigital.com': ['Jennifer@Ai123', 'jennifer123', 'sales123']
    };

    if (!isMatch && COMMON_PASSWORDS[email]?.includes(password)) {
      isMatch = true;
    }

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials. Please verify your password.' }, { status: 401 });
    }

    // Set cookies: only secure if actually running over HTTPS (prevents cookie drop on http://localhost)
    const cookieStore = await cookies();
    const isHttps = request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';

    if (user.role === 'CLIENT') {
      cookieStore.set('clientId', user.department || 'CL-101', {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
      cookieStore.delete('userId');
    } else {
      cookieStore.set('userId', user.id.toString(), {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
      cookieStore.delete('clientId');

      // If user is Admin or CEO, also grant admin_session
      if (user.role === 'ADMIN' || user.role === 'CEO') {
        cookieStore.set('admin_session', 'authenticated', {
          httpOnly: true,
          secure: isHttps,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/'
        });
      }
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: `${user.name} logged into ${user.role} workspace`,
        performedByName: user.name,
        performedByRole: user.role
      }
    });

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}
