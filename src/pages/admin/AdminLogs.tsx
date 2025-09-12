// src/pages/admin/AdminLogs.tsx
import React, { useEffect, useState } from "react";
import { fetchAdminLogs, type AdminLog } from "@/lib/fakeApi/admin";

const levelColor: Record<AdminLog["level"], string> = {
  info:  "text-primary",
  warn:  "text-[var(--warning)]",
  error: "text-[var(--danger)]",
};

const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  useEffect(() => { fetchAdminLogs().then(setLogs); }, []);

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">Логи</div>
      <div className="card p-0 overflow-hidden">
        {logs.map((l,) => (
          <div key={l.id} className="px-4 py-3 border-b border-[color-mix(in oklab,var(--border),transparent 40%)]">
            <div className="text-sm text-[var(--muted)]">{new Date(l.ts).toLocaleString()}</div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium ${levelColor[l.level]}`}>{l.level.toUpperCase()}</span>
              <span>{l.message}</span>
            </div>
          </div>
        ))}
        {logs.length === 0 && <div className="px-4 py-6 text-[var(--muted)]">Поки що немає логів…</div>}
      </div>
    </div>
  );
};

export default AdminLogs;
