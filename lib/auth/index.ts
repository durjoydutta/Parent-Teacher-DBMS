export * from './types';
export * from './db';
export * from './session';

import { findUserByCredentials } from './db';
import { createSession } from './session';
import type { User, AuthResponse } from './types';

export async function verifyCredentials(
  username: string,
  password: string,
  role: string
): Promise<AuthResponse> {
  try {
    if (!username || !password || !role) {
      return { 
        success: false, 
        message: 'Missing required fields' 
      };
    }

    const user = await findUserByCredentials(username, password, role);
    
    if (!user) {
      return { 
        success: false, 
        message: 'Invalid credentials' 
      };
    }

    createSession(user);

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      message: 'Authentication failed'
    };
  }
}