// src/components/ProtectedRoute.tsx
import React from "react";
import { useAuth } from "@/types/auth";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
const { user, initializing } = useAuth();


if (initializing) {
return (
<div className="max-w-md mx-auto card p-6 text-center">
<div className="text-xl font-semibold mb-2">Завантаження…</div>
<div className="text-[var(--muted)]">Перевіряємо сесію.</div>
</div>
);
}


if (!user) return <Navigate to="/login" replace />;


return children ? <>{children}</> : <Outlet />;
};


export default ProtectedRoute;