import React from "react";
import { StudentTiles } from "@/components/DashboardTiles";

const StudentDashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="text-2xl font-semibold">Панель студента</div>
    <StudentTiles />
  </div>
);

export default StudentDashboard;
