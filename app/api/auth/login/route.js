import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;
    const email = body.email?.toLowerCase().trim();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
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

    // Special bypass for admin default credentials
    if (!isMatch && email === 'admin@aidigital.com' && password === 'Ai_Digital@0701') {
      isMatch = true;
    }

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials. Please verify your password.' }, { status: 401 });
    }

    // Set cookies
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === 'production';

    if (user.role === 'CLIENT') {
      cookieStore.set('clientId', user.department || 'CL-101', {
        httpOnly: true,
        secure: isProd,
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
      cookieStore.delete('userId');
    } else {
      cookieStore.set('userId', user.id.toString(), {
        httpOnly: true,
        secure: isProd,
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
      cookieStore.delete('clientId');

      // If user is Admin or CEO, also grant admin_session
      if (user.role === 'ADMIN' || user.role === 'CEO') {
        cookieStore.set('admin_session', 'authenticated', {
          httpOnly: true,
          secure: isProd,
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
