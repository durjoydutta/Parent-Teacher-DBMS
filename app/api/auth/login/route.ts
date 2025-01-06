import { NextResponse } from 'next/server';
import { verifyCredentials } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await verifyCredentials(username, password, role).catch((err) => {
      console.error('Verification error:', err);
      throw err;
    });

    if (user) {
      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });

      // Set the `user` cookie
      response.cookies.set('user', JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
      }), {
        httpOnly: true, // Prevent access from client-side JavaScript
        path: '/',      // Ensure the cookie is available for all routes
        sameSite: 'lax',// Helps mitigate CSRF
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 60 * 60 * 24 * 7, // Cookie valid for 7 days
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    const err = error as Error;
    console.error('Login error:', {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });

    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        debug: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}
