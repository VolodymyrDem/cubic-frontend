//src/lib/fakeApi/student.ts
import { ok, uid } from "./index";
import type { StudentSchedule } from "@/types/schedule";
import type { HomeworkTask } from "@/types/homework";

export async function fetchStudentSchedule(studentId: string): Promise<StudentSchedule> {
  return ok({
    studentId,
    group: { id: "g1", name: "КН-41", subgroup: "a" },
    lessons: [
      { id: uid(), weekday: 1, time: { start: "08:30", end: "10:05" }, subject: "Математика", location: "ауд. 204", group: { id: "g1", name: "КН-41", subgroup: "a" }, parity: "any" },
      { id: uid(), weekday: 3, time: { start: "10:25", end: "12:00" }, subject: "ОПП", location: "ауд. 312", group: { id: "g1", name: "КН-41", subgroup: "a" }, parity: "even" },
      { id: uid(), weekday: 5, time: { start: "12:10", end: "13:45" }, subject: "БД", location: "ауд. 107", group: { id: "g1", name: "КН-41", subgroup: "a" }, parity: "odd" },
    ]
  });
}

export async function fetchStudentHomework(studentId: string): Promise<HomeworkTask[]> {
  console.log("Fetching homework for student", studentId);
  return ok([
    { id: uid(), subject: "БД", text: "Нормалізувати схему до 3НФ", createdAt: new Date().toISOString(), dueDate: "2025-09-15", groupId: "g1", teacherId: "t1",
      files: [{ id: uid(), url: "https://drive.google.com/file/d/xyz/view", title: "Приклад" }] },
    { id: uid(), subject: "ОПП", text: "Реалізувати патерн Observer", createdAt: new Date().toISOString(), dueDate: "2025-09-18", groupId: "g1", teacherId: "t2" }
  ]);
}
