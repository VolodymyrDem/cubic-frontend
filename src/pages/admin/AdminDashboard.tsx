//src/pages/admin/AdminDashboard.tsx
import React from "react";
import { AdminTiles } from "@/components/DashboardTiles";

const AdminDashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="text-2xl font-semibold">Адмін панель</div>
    <AdminTiles />
  </div>
);

export default AdminDashboard;
