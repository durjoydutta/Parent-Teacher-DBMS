import { pool } from '../db';
import { User } from './types';

export async function findUserByCredentials(
  username: string,
  password: string,
  role: string
): Promise<User | null> {
  try {
    const tableName = role === 'parent' ? 'parents' : 'teachers';
    const query = `
      SELECT id, username
      FROM ${tableName}
      WHERE username = $1 AND password = $2
    `;
    
    const result = await pool.query(query, [username, password]);
    const user = result.rows[0];

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      role: role as 'parent' | 'teacher'
    };
  } catch (error) {
    console.error('Database auth error:', error);
    throw new Error('Database authentication failed');
  }
}