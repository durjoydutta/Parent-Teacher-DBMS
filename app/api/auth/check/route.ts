import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const userCookie = cookies().get('user');
    
    if (!userCookie?.value) {
      return NextResponse.json({ user: null });
    }

    const user = JSON.parse(userCookie.value);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null });
  }
}