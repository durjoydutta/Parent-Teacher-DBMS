import { pool } from './db';

interface MeetingData {
  teacher_id: number;
  parent_id: number;
  student_id: number;
  subject: string;
  meeting_date: Date;
  meeting_time: string;
  reason: string;
  message?: string;
}

export async function createMeeting(data: MeetingData) {
  const query = `
    INSERT INTO meetings (
      teacher_id, parent_id, student_id, subject,
      meeting_date, meeting_time, reason, message, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
    RETURNING *
  `;

  console.log(data);

  const values = [
    data.teacher_id,
    data.parent_id,
    data.student_id,
    data.subject,
    data.meeting_date,
    data.meeting_time,
    data.reason,
    data.message || null
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
}

export async function getMeetingsByTeacher(teacherId: number) {
  const query = `
    SELECT 
      m.*,
      p.username as parent_name,
      s.name as student_name,
      s.roll_number,
      s.class
    FROM meetings m
    JOIN parents p ON m.parent_id = p.id
    JOIN students s ON m.student_id = s.id
    WHERE m.teacher_id = $1
    ORDER BY m.meeting_date ASC, m.meeting_time ASC
  `;

  try {
    const result = await pool.query(query, [teacherId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw error;
  }
}

export async function getMeetingsByParent(parentId: number) {
  const query = `
    SELECT 
      m.*,
      t.username as teacher_name,
      t.subject as teacher_subject,
      s.name as student_name,
      s.roll_number,
      s.class
    FROM meetings m
    JOIN teachers t ON m.teacher_id = t.id
    JOIN students s ON m.student_id = s.id
    WHERE m.parent_id = $1
    ORDER BY m.created_at DESC
  `;

  try {
    const result = await pool.query(query, [parentId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching meetings:', error);
    throw error;
  }
}

export async function updateMeetingStatus(meetingId: number, status: 'accepted' | 'rejected', message?: string) {
  const query = `
    UPDATE meetings 
    SET status = $1, message = $2
    WHERE id = $3
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [status, message || null, meetingId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating meeting status:', error);
    throw error;
  }
}