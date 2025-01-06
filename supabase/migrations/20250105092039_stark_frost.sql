-- Drop existing tables if they exist
DROP TABLE IF EXISTS meetings;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS parents;

-- Parents table
CREATE TABLE parents (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255)
);

-- Students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    roll_number VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    class VARCHAR(20) NOT NULL,
    parent_id INTEGER REFERENCES parents(id)
);

-- Teachers table
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    classes_taught TEXT[] -- Array of classes taught by the teacher
);

-- Meetings table
CREATE TABLE meetings (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id),
    parent_id INTEGER REFERENCES parents(id),
    student_id INTEGER REFERENCES students(id),
    subject VARCHAR(100) NOT NULL,
    meeting_date DATE NOT NULL,
    meeting_time TIME NOT NULL,
    reason TEXT NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
-- Parents
INSERT INTO parents (username, password, email) VALUES
('parent1', 'pass123', 'parent1@example.com'),
('parent2', 'pass123', 'parent2@example.com');

-- Students
INSERT INTO students (roll_number, name, class, parent_id) VALUES
('2024001', 'John Doe', '10A', 1),
('2024002', 'Jane Doe', '9B', 1),
('2024003', 'Alice Smith', '10A', 2);

-- Teachers
INSERT INTO teachers (username, password, subject, classes_taught) VALUES
('teacher1', 'pass123', 'Mathematics', ARRAY['9A', '9B', '10A']),
('teacher2', 'pass123', 'Science', ARRAY['10A', '10B']),
('teacher3', 'pass123', 'English', ARRAY['9A', '9B', '10A', '10B']);

-- Sample meetings
INSERT INTO meetings (teacher_id, parent_id, student_id, subject, meeting_date, meeting_time, reason, status) VALUES
(1, 1, 1, 'Mathematics', '2024-03-25', '10:00', 'Discuss recent test performance', 'pending'),
(2, 2, 3, 'Science', '2024-03-26', '14:30', 'Science project guidance', 'pending');