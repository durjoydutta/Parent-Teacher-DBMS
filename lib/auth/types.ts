export interface User {
  id: number;
  username: string;
  role: 'parent' | 'teacher';
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}