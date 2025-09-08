import React, { useEffect, useMemo, useState } from "react";
import { fetchTeacherDetailedSchedule, updateGlobalSchedule } from "@/lib/fakeApi/admin";
import type { TeacherSchedule } from "@/types/schedule";
import { useSearchParams } from "react-router-dom";

const AdminSchedule: React.FC = () => {
  const [sp] = useSearchParams();
  const teacherId = sp.get("teacher") ?? "t1";
  const [data, setData] = useState<TeacherSchedule | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { fetchTeacherDetailedSchedule(teacherId).then(setData); }, [teacherId]);

  const lessons = data?.lessons ?? [];
  const changedPayload = useMemo(() => ({ teacherId, lessons }), [teacherId, lessons]);

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">Редагування розкладу</div>
      <div className="card p-4">
        <div className="text-sm text-[var(--muted)]">TeacherId: {teacherId}</div>
        <div className="mt-2 space-y-2">
          {lessons.map(l => (
            <div key={l.id} className="rounded-xl border border-[var(--border)] p-3">
              <div className="font-medium">{l.subject}</div>
              <div className="text-sm text-[var(--muted)]">День: {l.weekday} · {l.time.start}—{l.time.end} · {l.location} · {l.group.name}</div>
            </div>
          ))}
        </div>
        <button
          className="btn-primary mt-4"
          disabled={busy}
          onClick={async () => { setBusy(true); await updateGlobalSchedule(changedPayload); setBusy(false); }}
        >
          {busy ? "Оновлюємо..." : "Оновити глобальний розклад"}
        </button>
      </div>
    </div>
  );
};

export default AdminSchedule;
