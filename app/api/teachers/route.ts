import { NextResponse } from 'next/server';
import { getTeachers } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const teachers = await getTeachers();
    return NextResponse.json({ success: true, teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}