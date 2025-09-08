import type { Id, ISODate } from "./common";

export type WeekParity = "even" | "odd" | "any";

export type GroupRef = { id: Id; name: string; subgroup?: "a" | "b" | null };

export type Lesson = {
  id: Id;
  weekday: 1|2|3|4|5|6|7; // 1=Mon
  time: { start: string; end: string }; // "08:30"
  subject: string;
  location?: string;
  teacherId?: Id;
  group: GroupRef;
  parity?: WeekParity; // якщо "even"/"odd", показувати лише у відповідний тиждень
};

export type StudentSchedule = {
  studentId: Id;
  group: GroupRef;
  lessons: Lesson[];
};

export type TeacherSchedule = {
  teacherId: Id;
  lessons: (Lesson & { group: GroupRef })[];
};

export type DaySchedule = { weekday: Lesson["weekday"]; lessons: Lesson[] };

export type ScheduleUpdate = {
  effectiveFrom: ISODate;
};
