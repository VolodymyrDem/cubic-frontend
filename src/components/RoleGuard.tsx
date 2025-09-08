import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth, type Role } from "@/types/auth";

const RoleGuard: React.FC<{ allow: Role[] }> = ({ allow }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default RoleGuard;
