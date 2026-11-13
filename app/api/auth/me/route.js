import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    let userIdStr = cookieStore.get('userId')?.value;

    // Fallback: If admin_session is authenticated but userId was not set
    if (!userIdStr && cookieStore.get('admin_session')?.value === 'authenticated') {
      userIdStr = '1';
    }

    if (!userIdStr) {
      const clientIdStr = cookieStore.get('clientId')?.value;
      if (clientIdStr) {
        const client = await prisma.client.findUnique({
          where: { clientId: clientIdStr }
        });
        if (client && client.active) {
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
      }
      return NextResponse.json({ user: null });
    }

    const userId = parseInt(userIdStr, 10);
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json({ user: null });
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
