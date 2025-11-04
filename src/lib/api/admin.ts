import { getAuthHeader } from "@/lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export type AdminStats = {
  students_total: number;
  students_confirmed: number;
  teachers_total: number;
  teachers_confirmed: number;
  courses_total: number;
};

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  if (!res.ok) throw new Error(`Failed to load admin stats: ${res.status}`);
  return res.json();
}

export type AdminStudent = {
  student_id: string;
  first_name: string;
  last_name: string;
  patronymic?: string | null;
  confirmed: boolean;
  email?: string | null;
};

export async function fetchAdminStudentsPaged(offset = 0, limit = 50): Promise<{ students: AdminStudent[]; total: number; }> {
  const res = await fetch(`${API_BASE_URL}/api/admin/students?offset=${offset}&limit=${limit}` ,{
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  if (!res.ok) throw new Error(`Failed to load students: ${res.status}`);
  return res.json();
}

export type AdminTeacher = {
  teacher_id: string;
  first_name: string;
  last_name: string;
  patronymic?: string | null;
  confirmed: boolean;
  email?: string | null;
};

export async function fetchAdminTeachersPaged(offset = 0, limit = 50): Promise<{ teachers: AdminTeacher[]; total: number; }> {
  const res = await fetch(`${API_BASE_URL}/api/admin/teachers?offset=${offset}&limit=${limit}` ,{
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  if (!res.ok) throw new Error(`Failed to load teachers: ${res.status}`);
  return res.json();
}
