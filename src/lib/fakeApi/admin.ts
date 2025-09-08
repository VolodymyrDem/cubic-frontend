import { ok, uid } from "./index";
import type { Teacher } from "@/types/teachers";
import type { TeacherSchedule } from "@/types/schedule";

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
