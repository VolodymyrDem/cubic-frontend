// src/components/RoleGuard.tsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth, type Role } from "@/types/auth";

const RoleGuard: React.FC<{ allow: Role[] }> = ({ allow }) => {
  const { user, initializing } = useAuth();

  // Якщо ще ініціалізуємось — бажано показати лоадер або нічого
  if (initializing) return null; // або ваш спінер

  // Немає сесії
  if (!user) return <Navigate to="/login" replace />;

  // user.role може бути undefined або null (pending_profile тощо)
  const role = user.role ?? null;
  if (!role || !allow.includes(role as Role)) {
    // тут можна редіректити на свою домашню сторінку або "/"
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
