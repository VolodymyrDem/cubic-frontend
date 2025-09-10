//src/types/homework.ts
import type { Id, ISODate, ISODateTime } from "./common";

export type TaskFileLink = { id: Id; url: string; title?: string };

export type HomeworkTask = {
  id: Id;
  subject: string;
  text: string;
  createdAt: ISODateTime;
  dueDate: ISODate;
  groupId: Id;
  teacherId: Id;
  files?: TaskFileLink[];
  doneBy?: Id[]; // studentIds хто відмітив виконаним
};
