// src/pages/admin/AdminArchive.tsx
import React from "react";
import { Link } from "react-router-dom";

type CardProps = React.PropsWithChildren<{
  title: string;
  to?: string;
  desc?: string;
}>;

const Card: React.FC<CardProps> = ({ title, to, desc, children }) => (
  <div className="card p-4">
    <div className="flex items-center justify-between">
      <div className="font-semibold">{title}</div>
      {to && <Link to={to} className="btn px-3 py-1 text-sm">відкрити</Link>}
    </div>
    {desc && <div className="text-sm text-[var(--muted)] mt-1">{desc}</div>}
    {children}
  </div>
);

const AdminArchive: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">Архів</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Минулорічні розклади" desc="2023/24, 2022/23 — експорти та знімки стану" />
        <Card title="Журнали змін (snapshot’и)" desc="Щотижневі знімки дашборду/розкладу" />
        <Card title="Експорти PDF" desc="Усі згенеровані PDF з датами" />
      </div>

      <div className="card p-0 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Тип</th>
              <th className="px-4 py-3">Назва</th>
              <th className="px-4 py-3">Дата</th>
              <th className="px-4 py-3">Розмір</th>
            </tr>
          </thead>
          <tbody>
            {[
              { type:"schedule", name:"Розклад 2023/24 (фінальний)", date:"2024-06-28 12:30", size:"1.2 MB" },
              { type:"pdf",      name:"Export-teachers-list.pdf",     date:"2025-09-10 09:12", size:"180 KB" },
              { type:"snapshot", name:"Weekly snapshot (W36)",        date:"2025-09-08 18:00", size:"820 KB" },
            ].map((r,i)=>(
              <tr key={i} className="border-t" style={{borderColor:"color-mix(in oklab, var(--border), transparent 40%)"}}>
                <td className="px-4 py-3">{r.type}</td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">{r.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminArchive;
