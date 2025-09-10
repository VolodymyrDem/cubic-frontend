//src/pages/teacher/TeacherAddAssignment.tsx
import React, { useState } from "react";
import { createAssignment } from "@/lib/fakeApi/teacher";
import type { HomeworkTask, TaskFileLink } from "@/types/homework";
import FileLinksInput from "@/components/FileLinksInput";
import { useAuth } from "@/types/auth";

const TeacherAddAssignment: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [groupId, setGroupId] = useState("g1");
  const [dueDate, setDueDate] = useState("");
  const [files, setFiles] = useState<TaskFileLink[]>([]);
  const [created, setCreated] = useState<HomeworkTask | null>(null);

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="text-2xl font-semibold">Додати завдання</div>
      <div className="card p-5 space-y-3">
        <input className="input" placeholder="Предмет" value={subject} onChange={e=>setSubject(e.target.value)} />
        <textarea className="input min-h-32" placeholder="Текст завдання" value={text} onChange={e=>setText(e.target.value)} />
        <div className="grid sm:grid-cols-3 gap-3">
          <input className="input sm:col-span-2" placeholder="ID групи" value={groupId} onChange={e=>setGroupId(e.target.value)} />
          <input className="input" type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
        </div>
        <FileLinksInput value={files} onChange={setFiles} />
        <button
          className="btn-primary"
          onClick={async () => {
            if (!user) return;
            const task = await createAssignment({
              subject, text, dueDate, groupId, teacherId: user.id, files
            });
            setCreated(task);
          }}
        >Створити</button>
      </div>

      {created && (
        <div className="card p-4">
          <div className="font-semibold">Створено ✅</div>
          <div>Предмет: {created.subject}</div>
          <div>Дедлайн: {created.dueDate}</div>
        </div>
      )}
    </div>
  );
};

export default TeacherAddAssignment;
