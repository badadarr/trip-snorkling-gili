import { NextResponse } from 'next/server';
import { seedDatabase } from '@/db/seed';
import { revalidateAllPublicData } from '@/lib/revalidate';

export async function GET() {
  const result = await seedDatabase();
  revalidateAllPublicData();
  return NextResponse.json(result);
}

export async function POST() {
  const result = await seedDatabase();
  revalidateAllPublicData();
  return NextResponse.json(result);
}
