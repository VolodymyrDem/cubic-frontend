//src/lib/fakeApi/admin.ts
import { ok, uid } from "./index";
import type { Teacher } from "@/types/teachers";
import type { TeacherSchedule } from "@/types/schedule";
import type { Student, Group } from "@/types/students";   // 👈 ДОДАТИ
import type { Course } from "@/types/courses"; 

export async function fetchTeachers(): Promise<Teacher[]> {
  return ok([
    { id: "t1", name: "Проф. Іваненко", email: "ivan@uni.ua", subjects: ["БД"] },
    { id: "t2", name: "Доцент Петренко", email: "petro@uni.ua", subjects: ["ОПП", "ПП"] },
  ]);
}

export async function fetchTeacherDetailedSchedule(teacherId: string): Promise<TeacherSchedule> {
  return ok({
    teacherId,
    lessons: [
      { id: uid(), weekday: 1, time: { start: "10:00", end: "11:35" }, subject: "БД", location: "107", group: { id: "g1", name: "КН-41" } },
    ],
  });
}

/** Імітація “оновити загальний розклад” */
export async function updateGlobalSchedule(_: unknown): Promise<{ ok: true }> {
  return ok({ ok: true });
}

export async function fetchAdminStats(): Promise<{ students: number; teachers: number; courses: number; }> {
  // Можна замінити на реальний запит, інтерфейс збережеться
  return ok({ students: 55, teachers: 69, courses: 14 });
}

export type AdminLog = { id: string; ts: string; level: "info" | "warn" | "error"; message: string };

export async function fetchAdminLogs(): Promise<AdminLog[]> {
  return ok([
    { id: uid(), ts: new Date().toISOString(), level: "info",  message: "System warmed up" },
    { id: uid(), ts: new Date().toISOString(), level: "warn",  message: "Cache miss for /courses" },
    { id: uid(), ts: new Date().toISOString(), level: "error", message: "Teacher sync failed: timeout" },
  ]);
}

export type ChangeItem = {
  id: string;
  ts: string;                              // ISO
  entity: "schedule" | "teacher" | "course" | "student";
  action: "created" | "updated" | "deleted";
  title: string;                           // короткий опис
  actor: string;                           // хто змінив
  trend?: number[];                        // для спарклайну (опц.)
};

export async function fetchChangeHistory(limit = 6): Promise<ChangeItem[]> {
  const now = Date.now();

  const items: ChangeItem[] = [
    { id: uid(), ts: new Date(now - 3_600_000).toISOString(),  entity: "schedule" as const, action: "updated" as const, title: "Правка розкладу КН-41", actor: "Admin", trend: [3,6,4,8,7,9] },
    { id: uid(), ts: new Date(now - 7_200_000).toISOString(),  entity: "teacher"  as const, action: "updated" as const, title: "Оновлено e-mail викладача", actor: "Admin", trend: [2,2,3,3,4,5] },
    { id: uid(), ts: new Date(now - 12_000_000).toISOString(), entity: "student"  as const, action: "created" as const, title: "Додано студента",           actor: "Admin", trend: [1,2,2,3,4,4] },
    { id: uid(), ts: new Date(now - 25_000_000).toISOString(), entity: "course"   as const, action: "deleted" as const, title: "Видалено дубль курсу",     actor: "Admin", trend: [9,7,5,6,4,3] },
    { id: uid(), ts: new Date(now - 36_000_000).toISOString(), entity: "schedule" as const, action: "updated" as const, title: "Перенесено пару",          actor: "Admin", trend: [5,6,5,7,6,7] },
    { id: uid(), ts: new Date(now - 48_000_000).toISOString(), entity: "teacher"  as const, action: "created" as const, title: "Додано викладача",         actor: "Admin", trend: [0,1,2,4,6,8] },
  ].slice(0, limit);

  return ok(items);
}

export async function fetchAdminGroups(): Promise<Group[]> {
  return ok([
    { id: "g1", name: "КН-41", size: 28 },
    { id: "g2", name: "КН-42", size: 27 },
    { id: "g3", name: "КН-43", size: 26 },
  ]);
}

export async function fetchAdminStudents(): Promise<Student[]> {
  return ok([
    { id: uid(), name: "Андрій Сидоренко", email: "andriy@uni.ua", groupId: "g1" },
    { id: uid(), name: "Марія Коваленко",  email: "maria@uni.ua",  groupId: "g1", subgroup: "a" },
    { id: uid(), name: "Ірина Василенко",  email: "iryna@uni.ua",  groupId: "g2" },
    { id: uid(), name: "Олег Ткаченко",    email: "oleh@uni.ua",   groupId: "g3", subgroup: "b" },
  ]);
}

export async function fetchAdminCourses(): Promise<Course[]> {
  return ok([
    { id: uid(), code: "DB101",  title: "Бази даних",                 groupIds: ["g1","g2"], teacherId: "t1" },
    { id: uid(), code: "CS201",  title: "Операційні системи",         groupIds: ["g2"],      teacherId: "t2" },
    { id: uid(), code: "PR301",  title: "Проєктний практикум",        groupIds: ["g1","g3"], teacherId: "t2" },
    { id: uid(), code: "ALG150", title: "Алгоритми та структури даних", groupIds: ["g3"],    teacherId: "t1" },
  ]);
}