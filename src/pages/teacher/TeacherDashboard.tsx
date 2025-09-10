//src/pages/teacher/TeacherDashboard.tsx
import React from "react";
import { TeacherTiles } from "@/components/DashboardTiles";

const TeacherDashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="text-2xl font-semibold">Панель викладача</div>
    <TeacherTiles />
  </div>
);

export default TeacherDashboard;
