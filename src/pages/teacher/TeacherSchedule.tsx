//src/pages/teacher/TeacherSchedule.tsx
import React, { useEffect, useState } from "react";
import { fetchTeacherSchedule } from "@/lib/fakeApi/teacher";
import type { TeacherSchedule as T } from "@/types/schedule";
import { useAuth } from "@/types/auth";

const days = ["","Пн","Вт","Ср","Чт","Пт","Сб","Нд"];

const TeacherSchedule: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<T | null>(null);
  useEffect(() => { if (user) fetchTeacherSchedule(user.id).then(setData); }, [user]);

  if (!data) return <div className="text-[var(--muted)]">Завантаження...</div>;

  const byDay = new Map<number, T["lessons"]>();
  for (let i=1;i<=7;i++) byDay.set(i, []);
  data.lessons.forEach(l => byDay.get(l.weekday)!.push(l));

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">Мій розклад (викладач)</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1,2,3,4,5,6,7].map(d => (
          <div className="card p-4" key={d}>
            <div className="font-semibold mb-2">{days[d]}</div>
            <div className="space-y-2">
              {byDay.get(d)!.length === 0 && <div className="text-[var(--muted)] text-sm">Немає занять</div>}
              {byDay.get(d)!.map(l => (
                <div key={l.id} className="rounded-xl border border-[var(--border)] p-3">
                  <div className="text-sm">{l.time.start} — {l.time.end}</div>
                  <div className="font-medium">{l.subject}</div>
                  <div className="text-sm text-[var(--muted)]">Група: {l.group.name} · {l.location ?? "—"}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSchedule;
