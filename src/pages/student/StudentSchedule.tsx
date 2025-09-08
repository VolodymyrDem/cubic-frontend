import React, { useEffect, useState } from "react";
import { fetchStudentSchedule } from "@/lib/fakeApi/student";
import type { StudentSchedule as T } from "@/types/schedule";
import { useAuth } from "@/types/auth";
import ScheduleWeek from "@/components/ScheduleWeek";

const StudentSchedule: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (user) fetchStudentSchedule(user.id).then(setData);
  }, [user]);

  if (!data) return <div className="text-[var(--muted)]">Завантаження...</div>;

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">Мій розклад — {data.group.name}{data.group.subgroup ? `/${data.group.subgroup}` : ""}</div>
      <ScheduleWeek lessons={data.lessons} />
    </div>
  );
};

export default StudentSchedule;
