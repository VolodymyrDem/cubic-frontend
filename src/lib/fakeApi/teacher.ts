import { ok, uid } from "./index";
import type { TeacherSchedule } from "@/types/schedule";
import type { Student } from "@/types/students";
import type { HomeworkTask } from "@/types/homework";

export async function fetchTeacherSchedule(teacherId: string): Promise<TeacherSchedule> {
  return ok({
    teacherId,
    lessons: [
      { id: uid(), weekday: 2, time: { start: "09:00", end: "10:35" }, subject: "БД", location: "ауд. 107", group: { id: "g1", name: "КН-41", subgroup: null } },
      { id: uid(), weekday: 4, time: { start: "13:00", end: "14:35" }, subject: "ОПП", location: "ауд. 312", group: { id: "g2", name: "КН-42", subgroup: "b" } },
    ]
  });
}

export async function fetchMyStudents(teacherId: string): Promise<Student[]> {
  console.log("Fetching students for teacher", teacherId);
  return ok([
    { id: uid(), name: "Анастасія", email: "n1@uni.ua", groupId: "g1" },
    { id: uid(), name: "Данило", email: "n2@uni.ua", groupId: "g2", subgroup: "b" },
  ]);
}

export async function createAssignment(task: Omit<HomeworkTask, "id" | "createdAt">): Promise<HomeworkTask> {
  return ok({ ...task, id: uid(), createdAt: new Date().toISOString() });
}
