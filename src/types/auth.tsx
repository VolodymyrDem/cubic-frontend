import React, { createContext, useContext, useMemo, useState } from "react";

export type Role = "student" | "teacher" | "admin";

export type User = {
  id: string;
  name: string;
  role: Role;
  email: string;
};

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string, role: Role) => Promise<void>;
  register: (name: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "fh.auth";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<User | null>(() => {
  // 🔧 для тесту — завжди студент
  return {
    id: "1",
    name: "Test Student",
    role: "admin",
    email: "student@example.com",
  };
});

  // const [user, setUser] = useState<User | null>(() => {
  //   const raw = localStorage.getItem(KEY);
  //   return raw ? (JSON.parse(raw) as User) : null;
  // });
  const [loading, setLoading] = useState(false);

  const login = async (email: string, _password: string, role: Role) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const u: User = { id: uid(), name: email.split("@")[0], role, email };
    setUser(u);
    localStorage.setItem(KEY, JSON.stringify(u));
    setLoading(false);
  };

  const register = async (name: string, email: string, _password: string, role: Role) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const u: User = { id: uid(), name, role, email };
    setUser(u);
    localStorage.setItem(KEY, JSON.stringify(u));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY);
  };

  const value = useMemo(() => ({ user, login, register, logout, loading }), [user, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
