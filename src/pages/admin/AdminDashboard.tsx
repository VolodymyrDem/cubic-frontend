// src/pages/admin/AdminDashboard.tsx
import React from "react";
import AdminQuickPanel from "@/components/AdminQuickPanel";
import AdminHistoryPanel from "@/components/AdminHistoryPanel"; // 👈 ДОДАТИ

const AdminDashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="text-2xl font-semibold">Адмін панель</div>
    <AdminQuickPanel />

    {/* секція нижче: історія + зарезервоване місце під майбутній контент */}
    <div className="grid gap-4 lg:grid-cols-4">
      <div className="lg:col-span-1">
        <AdminHistoryPanel />
      </div>
      <div className="lg:col-span-3">
        {/* тут можна додати графіки/таблиці пізніше */}
      </div>
    </div>
  </div>
);

export default AdminDashboard;
