export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ success: true, count: users.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
