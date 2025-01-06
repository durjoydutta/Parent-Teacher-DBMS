import { pool } from './db';

export interface User {
  id: number;
  username: string;
  role: 'parent' | 'teacher';
}

export async function verifyCredentials(
  username: string, 
  password: string, 
  role: string
): Promise<User | null> {
  try {
    // Use parameterized query to prevent SQL injection
    const query = `
      SELECT id, username, password 
      FROM ${role === 'parent' ? 'parents' : 'teachers'}
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
    console.error('Authentication error:', error);
    throw error;
  }
}

export async function getTeachers() {
  try {
    const query = 'SELECT id, username, subject FROM teachers';
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
}

export async function getStudents(parentId: number) {
  const query = `
    SELECT id, roll_number, name, class
    FROM students
    WHERE parent_id = $1;
  `;

  try {
    const { rows } = await pool.query(query, [parentId]);
    return rows;
  } catch (error) {
    console.error('Error fetching students from database:', error);
    throw new Error('Database query failed');
  }
}