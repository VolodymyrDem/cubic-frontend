import React from "react";
import { useAuth } from "@/types/auth";
import { AdminTiles, StudentTiles, TeacherTiles } from "@/components/DashboardTiles";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Головна</div>
      {!user && (
        <div className="card p-5">
          <div className="text-[var(--muted)]">Увійди, щоб бачити персональний функціонал</div>
          <div className="mt-3 flex gap-2">
            <Link className="btn-primary" to="/login">Увійти</Link>
            <Link className="btn" to="/register">Зареєструватися</Link>
          </div>
        </div>
      )}
      {user?.role === "student" && <StudentTiles />}
      {user?.role === "teacher" && <TeacherTiles />}
      {user?.role === "admin" && <AdminTiles />}
    </div>
  );
};

export default Home;
