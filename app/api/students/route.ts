import { NextResponse } from 'next/server';
import { getStudents } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentId = searchParams.get('parentId');

  if (!parentId) {
    return NextResponse.json(
      { success: false, message: 'Parent ID is required' },
      { status: 400 }
    );
  }

  try {
    const students = await getStudents(parseInt(parentId, 10));
    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
