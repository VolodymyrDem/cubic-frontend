//src/pages/teacher/TeacherStudents.tsx
import React, { useEffect, useState } from "react";
import { fetchMyStudents } from "@/lib/fakeApi/teacher";
import type { Student } from "@/types/students";
import { useAuth } from "@/types/auth";

const TeacherStudents: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  useEffect(() => { if (user) fetchMyStudents(user.id).then(setStudents); }, [user]);

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">Студенти</div>
      <div className="grid gap-3">
        {students.map(s => (
          <div key={s.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-[var(--muted)]">{s.email} · {s.groupId}{s.subgroup ? `/${s.subgroup}` : ""}</div>
            </div>
            <button className="btn">Відкрити профіль</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherStudents;
