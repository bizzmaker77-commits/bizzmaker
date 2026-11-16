import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    const clients = await prisma.client.findMany();
    return NextResponse.json({ success: true, usersCount: users.length, clientsCount: clients.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
