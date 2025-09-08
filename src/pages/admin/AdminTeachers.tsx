import React, { useEffect, useState } from "react";
import { fetchTeachers } from "@/lib/fakeApi/admin";
import type { Teacher } from "@/types/teachers";
import { Link } from "react-router-dom";

const AdminTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  useEffect(() => { fetchTeachers().then(setTeachers); }, []);

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">Викладачі</div>
      <div className="grid gap-3">
        {teachers.map(t => (
          <div key={t.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-[var(--muted)]">{t.email} · {t.subjects.join(", ")}</div>
            </div>
            <Link to={`/admin/schedule?teacher=${t.id}`} className="btn">Розклад</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTeachers;
