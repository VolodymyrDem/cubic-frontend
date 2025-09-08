import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useHideOnScroll } from "@/lib/hooks/useHideOnScroll";
import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@/types/auth";
import { cls } from "@/lib/utils/cls";

const Header: React.FC = () => {
  const hidden = useHideOnScroll();
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className={cls(
      "fixed inset-x-0 top-0 z-50 transition-transform duration-300",
      hidden ? "-translate-y-full" : "translate-y-0"
    )}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--card)]/90 backdrop-blur card px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">🎓 Faculty Helper</Link>
          <nav className="hidden md:flex gap-4 text-sm">
            <NavLink to="/" className="hover:opacity-80">Головна</NavLink>
            {user?.role === "student" && (
              <>
                <NavLink to="/student/schedule">Мій розклад</NavLink>
                <NavLink to="/student/homework">Домашнє</NavLink>
              </>
            )}
            {user?.role === "teacher" && (
              <>
                <NavLink to="/teacher/schedule">Мій розклад</NavLink>
                <NavLink to="/teacher/students">Студенти</NavLink>
                <NavLink to="/teacher/add-assignment">Додати завдання</NavLink>
              </>
            )}
            {user?.role === "admin" && (
              <>
                <NavLink to="/admin/teachers">Викладачі</NavLink>
                <NavLink to="/admin/schedule">Розклад</NavLink>
              </>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <button className="btn" onClick={toggle} title="Перемкнути тему">
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            {user ? (
              <button className="btn" onClick={() => { logout(); nav("/"); }}>
                Вийти
              </button>
            ) : (
              <Link to="/login" className="btn">Увійти</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
