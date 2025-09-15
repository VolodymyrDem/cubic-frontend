// src/pages/teacher/TeacherSubject.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/types/auth";
import { fetchTeacherSubject, type TeacherSubjectDetails } from "@/lib/fakeApi/teacher";
import Reveal from "@/components/Reveal";
import Crossfade from "@/components/Crossfade";
import { BookOpen, ExternalLink, Video, FileText, ChevronLeft, GraduationCap, Users, ArrowUpDown } from "lucide-react";


const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="px-2 py-0.5 rounded-full bg-[var(--muted)]/10 text-[var(--muted)] text-xs">{children}</span>
);
const RowLink: React.FC<{ href: string; children: React.ReactNode; title?: string }> = ({ href, children, title }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-2 underline hover:opacity-80 break-all [overflow-wrap:anywhere]"
    title={title}
  >
    {children} <ExternalLink className="w-4 h-4" />
  </a>
);

const TeacherSubject: React.FC = () => {
  const { subjectId = "" } = useParams<{ subjectId: string }>();
  const { user } = useAuth();
  const [data, setData] = React.useState<TeacherSubjectDetails | null>(null);
  type SortKey = "name" | "email" | "group" | "total";
type SortDir = "asc" | "desc";
const [sort, setSort] = React.useState<{ key: SortKey; dir: SortDir }>({ key: "name", dir: "asc" });
const rows = React.useMemo(() => {
  const list = (data?.students ?? []).map(({ student, grades }) => ({
    student,
    grades,
    total: grades.reduce((s, g) => s + g.points, 0),
    name: student.name,
    email: student.email ?? "",
    group: student.groupId + (student.subgroup ? `/${student.subgroup}` : ""),
  }));
  return list;
}, [data?.students]);

const sorted = React.useMemo(() => {
  const arr = [...rows];
  const { key, dir } = sort;
  arr.sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    if (key === "total") {
      return dir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    }
    // рядкове порівняння, case-insensitive
    const sa = String(va).toLocaleLowerCase();
    const sb = String(vb).toLocaleLowerCase();
    if (sa < sb) return dir === "asc" ? -1 : 1;
    if (sa > sb) return dir === "asc" ? 1 : -1;
    return 0;
  });
  return arr;
}, [rows, sort]);

function toggleSort(key: SortKey) {
  setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
}

function ariaFor(key: SortKey): React.AriaAttributes["aria-sort"] {
  if (sort.key !== key) return "none";
  return sort.dir === "asc" ? "ascending" : "descending";
}

  React.useEffect(() => {
    if (!user || !subjectId) return;
    let alive = true;
    fetchTeacherSubject(user.id, subjectId).then(res => { if (alive) setData(res); });
    return () => { alive = false; };
  }, [user, subjectId]);

  // ✅ Хуки/обчислення — ДО будь-яких умовних return
  const grades = data?.recentGrades ?? [];
  React.useMemo(() => {
        const sumPoints = grades.reduce((s, g) => s + g.points, 0);
        const sumMaxVal = grades.reduce((s, g) => s + (typeof g.max === "number" ? g.max : 0), 0);
        return { sumPoints, sumMax: sumMaxVal > 0 ? sumMaxVal : undefined, countGrades: grades.length };
    }, [grades]);

  const classroomUrl =
    data?.upcomingHomework.find(h => h.classroomUrl)?.classroomUrl ||
    data?.recentGrades.find(g => g.classroomUrl)?.classroomUrl;

  if (!data) return <div className="text-[var(--muted)]">Завантаження...</div>;


  return (
    <div className="space-y-5 break-words [overflow-wrap:anywhere]">
      <Reveal className="flex items-center justify-between" delayMs={80} y={8} opacityFrom={0}>
        <div className="flex items-center gap-3 min-w-0">
          <BookOpen className="w-7 h-7 text-primary" />
          <div className="text-2xl font-semibold break-words [overflow-wrap:anywhere]">{data.name}</div>
        </div>
        <Link to="/teacher/schedule" className="inline-flex items-center gap-2 text-sm hover:opacity-80 hover-lift">
          <ChevronLeft className="w-4 h-4" /> До розкладу
        </Link>
      </Reveal>

      {/* Верхній інформаційний блок */}
      <Reveal y={6} blurPx={6} opacityFrom={0} delayMs={60}>
        <div className="glasscard hover-lift rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="text-sm text-[var(--muted)]">Викладач</div>
            <div className="font-medium break-words [overflow-wrap:anywhere]">
              {data.teacher.name}{" "}
              {data.teacher.email && (
                <span className="text-[var(--muted)]">· {data.teacher.email}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data.meetingUrl ? (
              <a
                href={data.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-contrast)] inline-flex items-center gap-2 hover-lift"
              >
                <Video className="w-4 h-4" /> Посилання на пару
              </a>
            ) : (
              <span className="text-[var(--muted)] text-sm">Посилання на пару не вказано</span>
            )}
            {classroomUrl && (
              <a
                href={classroomUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-contrast)] inline-flex items-center gap-2 hover-lift"
              >
                <GraduationCap className="w-4 h-4" /> Classroom
              </a>
            )}
          </div>
        </div>
      </Reveal>

      <Crossfade stateKey={data.id}>
        <Reveal y={8} blurPx={8} opacityFrom={0} delayMs={90}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {/* Матеріали */}
            <div className="glasscard hover-lift rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Матеріали</div>
                <Chip>{data.materials.length}</Chip>
              </div>
              <div className="space-y-2">
                {data.materials.map(m => (
                  <div key={m.id} className="flex items-center justify-between gap-2 py-2 border-b border-[var(--border)]/50 last:border-b-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4" />
                      <div className="break-words [overflow-wrap:anywhere] max-w-full">{m.title}</div>
                    </div>
                    <RowLink href={m.url}>Відкрити</RowLink>
                  </div>
                ))}
              </div>
            </div>

            {/* Найближчі ДЗ */}
            <div className="glasscard hover-lift rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Найближчі ДЗ</div>
                <Chip>{data.upcomingHomework.length}</Chip>
              </div>
              <div className="space-y-2">
                {data.upcomingHomework.length === 0 && <div className="text-[var(--muted)] text-sm">Немає запланованих</div>}
                {data.upcomingHomework.map(hw => (
                  <div key={hw.id} className="py-2 border-b border-[var(--border)]/50 last:border-b-0">
                    <div className="font-medium break-words [overflow-wrap:anywhere]">{hw.text}</div>
                    <div className="text-sm text-[var(--muted)]">Дедлайн: {new Date(hw.dueDate).toLocaleDateString()}</div>
                    {hw.classroomUrl && <RowLink href={hw.classroomUrl}>Classroom</RowLink>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Crossfade>

      <Reveal y={6} blurPx={6} opacityFrom={0} delayMs={60}>
  <div className="glasscard hover-lift rounded-2xl p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="font-semibold inline-flex items-center gap-2">
        <Users className="w-5 h-5" /> Студенти ( {rows.length} )
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-[var(--muted)]">
          <tr className="border-b border-[var(--border)]/60">
            <th className="text-left py-2 pr-3 w-10">#</th>

            <th
              role="button"
              aria-sort={ariaFor("name")}
              onClick={() => toggleSort("name")}
              className="text-left py-2 pr-3 cursor-pointer select-none"
              title="Сортувати за ПІБ"
            >
              <span className="inline-flex items-center gap-1">
                Студент
                <ArrowUpDown className="w-4 h-4 opacity-70" />
              </span>
            </th>

            <th
              role="button"
              aria-sort={ariaFor("email")}
              onClick={() => toggleSort("email")}
              className="text-left py-2 pr-3 cursor-pointer select-none"
              title="Сортувати за email"
            >
              <span className="inline-flex items-center gap-1">
                Email
                <ArrowUpDown className="w-4 h-4 opacity-70" />
              </span>
            </th>

            <th
              role="button"
              aria-sort={ariaFor("group")}
              onClick={() => toggleSort("group")}
              className="text-left py-2 pr-3 cursor-pointer select-none"
              title="Сортувати за групою"
            >
              <span className="inline-flex items-center gap-1">
                Група
                <ArrowUpDown className="w-4 h-4 opacity-70" />
              </span>
            </th>

            <th
              role="button"
              aria-sort={ariaFor("total")}
              onClick={() => toggleSort("total")}
              className="text-right py-2 cursor-pointer select-none"
              title="Сортувати за сумою балів"
            >
              <span className="inline-flex items-center gap-1 justify-end w-full">
                Сума балів
                <ArrowUpDown className="w-4 h-4 opacity-70" />
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {sorted.map(({ student, email, group, total }, idx) => (
            <tr key={student.id} className="border-b border-[var(--border)]/40 last:border-b-0">
              <td className="py-2 pr-3 text-[var(--muted)]">{idx + 1}</td>
              <td className="py-2 pr-3">{student.name}</td>
              <td className="py-2 pr-3">
                {email ? <a href={`mailto:${email}`} className="underline">{email}</a> : <span className="text-[var(--muted)]">—</span>}
              </td>
              <td className="py-2 pr-3">{group}</td>
              <td className="py-2 text-right font-medium">{total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</Reveal>

      {data.description && (
        <Reveal y={6} blurPx={6} opacityFrom={0} delayMs={60}>
          <div className="glasscard hover-lift rounded-2xl p-4">
            <div className="font-semibold mb-2">Про курс</div>
            <p className="text-[var(--muted)] break-words [overflow-wrap:anywhere]">{data.description}</p>
          </div>
        </Reveal>
      )}
    </div>
  );
};

export default TeacherSubject;
