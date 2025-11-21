// src/lib/api/schedule-api.ts

import { api } from "@/lib/api";

// ---- Backend DTO types ----

export type ScheduleStatus = "pending" | "generated" | "failed" | "archived";

export interface ScheduleListItemDto {
  id: string;
  name: string;
  semester?: string | null;
  isActive: boolean;
  status: ScheduleStatus;
  version?: number | null;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface ScheduleListResponseDto {
  items: ScheduleListItemDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ScheduleGenerationRequestDto {
  name: string;
  semester?: string;
  facultyId?: string;
  startDate?: string;          // "YYYY-MM-DD"
  endDate?: string;            // "YYYY-MM-DD"
  maxLessonsPerDay?: number;
  respectPreferences?: boolean;
}

export interface ScheduleGenerationResponseDto {
  scheduleId: string;
  status: ScheduleStatus;      // "pending" | "generated" | "failed"
  message?: string | null;
}

export type ParityDto = "odd" | "even" | "both";

export interface AssignmentDto {
  id: string;
  scheduleId: string;
  groupId: string;
  groupName?: string | null;
  courseId: string;
  courseName?: string | null;
  teacherId: string;
  teacherName?: string | null;
  roomId: string;
  roomName?: string | null;
  weekday: number;             // 1..7
  parity: ParityDto;
  startTime: string;           // "HH:MM"
  endTime: string;             // "HH:MM"
  subgroup?: number | null;
}

export interface ScheduleWithAssignmentsDto extends ScheduleListItemDto {
  assignments: AssignmentDto[];
}

// ---- Teacher / Student schedule DTOs ----

export interface TeacherScheduleDto {
  teacherId: string;
  scheduleId: string;
  lessons: AssignmentDto[];
}

export interface StudentScheduleDto {
  studentId: string;
  scheduleId: string;
  lessons: AssignmentDto[];
}

// ---- API functions ----

// Запуск генерації розкладу (бекенд за замовчуванням працює в async-режимі)
export async function generateSchedule(
  payload: ScheduleGenerationRequestDto,
  opts?: { async?: boolean }
): Promise<ScheduleGenerationResponseDto> {
  const query = opts?.async === false ? "?async=false" : "";
  return await api.post(`/api/schedules/generate${query}`, payload);
}

// Отримати список розкладів (версії / архів)
export async function fetchSchedules(
  params?: { page?: number; pageSize?: number; status?: ScheduleStatus }
): Promise<ScheduleListResponseDto> {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.pageSize) search.set("pageSize", String(params.pageSize));
  if (params?.status) search.set("status", params.status);
  const qs = search.toString();
  const suffix = qs ? `?${qs}` : "";
  return await api.get(`/api/schedules${suffix}`);
}

// Деталі конкретного розкладу (метадані + assignments)
export async function fetchScheduleById(
  scheduleId: string,
  opts?: { includeAssignments?: boolean }
): Promise<ScheduleWithAssignmentsDto> {
  const search = new URLSearchParams();
  if (opts?.includeAssignments === false) {
    search.set("includeAssignments", "false");
  }
  const qs = search.toString();
  const suffix = qs ? `?${qs}` : "";
  return await api.get(`/api/schedules/${scheduleId}${suffix}`);
}

// Розклад викладача для активного (або заданого) розкладу
export async function fetchTeacherSchedule(
  teacherId: string,
  params?: { scheduleId?: string; fromDate?: string; toDate?: string }
): Promise<TeacherScheduleDto> {
  const search = new URLSearchParams();
  if (params?.scheduleId) search.set("scheduleId", params.scheduleId);
  if (params?.fromDate) search.set("fromDate", params.fromDate);
  if (params?.toDate) search.set("toDate", params.toDate);
  const qs = search.toString();
  const suffix = qs ? `?${qs}` : "";
  return await api.get(`/api/schedules/teacher/${teacherId}${suffix}`);
}

// Розклад студента (знадобиться трохи пізніше)
export async function fetchStudentSchedule(
  studentId: string,
  params?: { scheduleId?: string; fromDate?: string; toDate?: string }
): Promise<StudentScheduleDto> {
  const search = new URLSearchParams();
  if (params?.scheduleId) search.set("scheduleId", params.scheduleId);
  if (params?.fromDate) search.set("fromDate", params.fromDate);
  if (params?.toDate) search.set("toDate", params.toDate);
  const qs = search.toString();
  const suffix = qs ? `?${qs}` : "";
  return await api.get(`/api/schedules/student/${studentId}${suffix}`);
}

export async function waitForScheduleGenerated(
  scheduleId: string,
  opts: { maxAttempts?: number; delayMs?: number } = {},
): Promise<ScheduleWithAssignmentsDto> {
  const maxAttempts = opts.maxAttempts ?? 15;
  const delayMs = opts.delayMs ?? 2000;

  for (let i = 0; i < maxAttempts; i++) {
    const current = await fetchScheduleById(scheduleId);
    if (current.status !== "pending") {
      return current;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  // Якщо після N спроб все ще pending — кидаємо помилку
  throw new Error("Schedule generation is still pending after timeout");
}