export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const count = await prisma.callRecord.count().catch(() => 0);
    return NextResponse.json({ success: true, count });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
