import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/types/auth";

const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
