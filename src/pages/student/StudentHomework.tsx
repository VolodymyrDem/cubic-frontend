//src/pages/student/StudentHomework.tsx
import React, { useEffect, useState } from "react";
import { fetchStudentHomework } from "@/lib/fakeApi/student";
import type { HomeworkTask } from "@/types/homework";
import { useAuth } from "@/types/auth";
import HomeworkList from "@/components/HomeworkList";

const StudentHomework: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<HomeworkTask[]>([]);
  useEffect(() => { if (user) fetchStudentHomework(user.id).then(setTasks); }, [user]);

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">Домашні завдання</div>
      <HomeworkList tasks={tasks} />
    </div>
  );
};

export default StudentHomework;
