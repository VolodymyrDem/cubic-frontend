// src/components/AdminQuickPanel.tsx

import React, { useEffect, useState } from "react";
import { fetchAdminStats as fetchAdminStatsReal } from "@/lib/api/admin";
import { generateSchedule } from "@/lib/api/schedule-api";
import type { ScheduleGenerationRequestDto } from "@/lib/api/schedule-api";
import { Users, BookOpen, Archive, IdCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ViewModeToggle from "./ViewModeToggle";
import Toast from "@/components/Toast";
import type { ViewMode } from "@/lib/utils/prefs";
import ExportButtons from "@/components/ExportButtons";
import Reveal from "./Reveal";
import Crossfade from "./Crossfade";

type Stats = { students: number; teachers: number; courses: number };

const StatTile: React.FC<{
  to: string;
  title: string;
  count?: number;
  subtitle?: string;
  icon?: React.ReactNode;
}> = ({ to, title, count, subtitle, icon }) => (
  <Link to={to} className="glasscard p-5 hover-lift pressable">
    <div className="flex items-start justify-between">
      <div className="text-3xl mb-2">{icon ?? "📊"}</div>
      {typeof count === "number" && (
        <div className="text-4xl font-semibold leading-none">{count}</div>
      )}
    </div>
    <div className="font-semibold text-lg">{title}</div>
    {subtitle && (
      <div className="text-sm text-[var(--muted)] mt-1">{subtitle}</div>
    )}
  </Link>
);

const AdminQuickPanel: React.FC<{
  value: ViewMode;
  onChange: (m: ViewMode) => void;
}> = ({ value, onChange }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const nav = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [solving, setSolving] = useState(false); // стан генерації розкладу

  useEffect(() => {
    fetchAdminStatsReal()
      .then((s) =>
        setStats({
          students: s.students_total,
          teachers: s.teachers_total,
          courses: s.courses_total,
        }),
      )
      .catch(() => setStats(null));
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1000);
  };

  const handleSolveClick = async () => {
    if (solving) return;
    setSolving(true);
    try {
      const payload: ScheduleGenerationRequestDto = {
        name: `Auto-generated schedule ${new Date().toLocaleString("uk-UA")}`,
        // TODO: коли буде facultyId / semester / дати з бекенду — підставити сюди
        respectPreferences: true,
      };

      const res = await generateSchedule(payload);

      if (res.status === "pending") {
        flash("Генерація розкладу запущена (status: pending)");
      } else if (res.status === "generated") {
        flash("Розклад згенеровано");
      } else if (res.status === "failed") {
        flash("Помилка: генерація розкладу не вдалася");
      } else {
        flash(`Статус генерації: ${res.status}`);
      }
    } catch (e) {
      console.error("Failed to generate schedule", e);
      flash("Помилка генерації розкладу");
    } finally {
      setSolving(false);
    }
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {!isMobile && (
          <ViewModeToggle
            value={value}
            onChange={(m) => {
              onChange(m);
              flash(
                m === "view"
                  ? "Увімкнено режим перегляду"
                  : "Увімкнено режим редагування",
              );
            }}
          />
        )}
        <StatTile
          to="/admin/students"
          title="Студенти"
          subtitle="Перегляд / керування"
          count={stats?.students}
          icon={<Users className="h-8 w-8 text-primary" />}
        />
        <StatTile
          to="/admin/teachers"
          title="Викладачі"
          subtitle="Список і розклади"
          count={stats?.teachers}
          icon={<Users className="h-8 w-8 text-primary" />}
        />
        <StatTile
          to="/admin/courses"
          title="Курси"
          subtitle="Предмети та групи"
          count={stats?.courses}
          icon={<BookOpen className="h-8 w-8 text-primary" />}
        />
        <StatTile
          to="/admin/archive"
          title="Архів"
          subtitle="Знімки, історія, PDF"
          icon={<Archive className="h-8 w-8 text-primary" />}
        />
        <StatTile
          to="/admin/registrations"
          title="Заявки на реєстрацію"
          subtitle="Перегляд / керування"
          icon={<IdCard className="h-8 w-8 text-primary" />}
        />
      </div>

      {!isMobile && (
        <div className="mt-4">
          <Crossfade stateKey={value}>
            {value === "view" ? (
              <Reveal y={6} opacityFrom={0}>
                <ExportButtons
                  onExportAll={() => flash("Експорт усього розкладу")}
                  onExportCourse={() => flash("Експорт обраного курсу")}
                  onExportLevel={() => flash("Експорт бакалаврів / магістрів")}
                />
              </Reveal>
            ) : (
              <Reveal y={6} opacityFrom={0}>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    className="btn py-3 rounded-2xl hover-shadow"
                    onClick={handleSolveClick}
                    disabled={solving}
                  >
                    {solving ? "Генеруємо..." : "Вирішити"}
                  </button>
                  <button
                    className="btn py-3 rounded-2xl hover-shadow"
                    onClick={() => flash("optimize is done")}
                  >
                    Оптимізувати
                  </button>
                  <button
                    className="btn py-3 rounded-2xl hover-shadow"
                    onClick={() => nav("/admin/logs")}
                  >
                    Логи
                  </button>
                </div>
              </Reveal>
            )}
          </Crossfade>
        </div>
      )}

      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
};

export default AdminQuickPanel;
