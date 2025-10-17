// src/types/auth.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "@/lib/api";
import { startGoogleOAuth } from "@/lib/googleAuth";

export type Role = "student" | "teacher" | "admin";
export type UserStatus = "active" | "pending_profile" | "pending_approval" | "disabled";

export type User = {
  id: string;
  name: string;
  email: string;
  role?: Role | null;
  status: UserStatus;
};

type AuthCtx = {
  user: User | null;
  initializing: boolean; // перший автологін / перевірка сесії
  loading: boolean; // запити типу logout тощо
  loginWithGoogle: () => void; // PROD: редірект на бекенд
  refreshMe: () => Promise<void>; // підтягнути сесію з cookie
  logout: () => Promise<void>;
  /** DEV-тільки: миттєво підставити роль без Google */
  loginAs?: (role: Role) => void;
};

// ---- DEV SWITCH ----
// .env: VITE_DEV_AUTH=1 для заглушок; VITE_DEV_AUTH=0 для прод
// За замовчуванням ВИМКНЕНО в проді ("0"), щоб після логіну брати користувача з бекенду
const DEV_AUTH = (import.meta.env.VITE_DEV_AUTH ?? "0") === "1";

// ключ для localStorage
const STORAGE_KEY = "cubic.auth.user";

// безпечні хелпери для збереження/читання з localStorage
function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function saveStoredUser(user: User | null) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  // ----------- PROD: /api/auth/me -----------
  const refreshMe = useCallback(async () => {
    // Check if token exists before making API call
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      saveStoredUser(null);
      return;
    }

    try {
      // Backend returns plain user object with fields like user_id, first_name, last_name, email, role
  const me = await api.get<any>("/api/auth/me");
      const mapped: User | null = me
        ? {
            id: me.user_id ?? me.id ?? "",
            name: (me.first_name && me.last_name)
              ? `${me.first_name} ${me.last_name}`
              : (me.name ?? me.email ?? ""),
            email: me.email ?? "",
            role: me.role ?? null,
            status: (me.is_active === false) ? "disabled" : "active",
          }
        : null;
      setUser(mapped);
      try {
        console.log('[AUTH][refreshMe] Loaded user:', {
          id: mapped?.id,
          name: mapped?.name,
          email: mapped?.email,
          role: mapped?.role,
          status: mapped?.status,
        });
      } catch {}
      saveStoredUser(mapped); // синхронізуємо й локально
    } catch {
      setUser(null);
      saveStoredUser(null);
      // Clear invalid token
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  }, []);

  useEffect(() => {
    // DEV: відновлюємо користувача з localStorage і завершуємо ініціалізацію
    if (DEV_AUTH) {
      const stored = loadStoredUser();
      if (stored) setUser(stored);
      setInitializing(false);
      return;
    }

    // PROD: одна перевірка сесії при монтуванні
    void (async () => {
      await refreshMe();
      setInitializing(false);
    })();
  }, [refreshMe]);

  // Listen for storage changes (when token is saved in another tab or after OAuth callback)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' && e.newValue) {
        // Token was added - refresh user data
        void refreshMe();
      } else if (e.key === 'access_token' && !e.newValue) {
        // Token was removed - logout
        setUser(null);
        saveStoredUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshMe]);

  // будь-яка зміна user — зберігаємо локально (дублюємо на випадок ручних змін)
  useEffect(() => {
    saveStoredUser(user);
    if (user) {
      try {
        console.log('[AUTH] User set:', { id: user.id, name: user.name, email: user.email, role: user.role });
      } catch {}
    } else {
      try { console.log('[AUTH] User cleared'); } catch {}
    }
  }, [user]);

  // ----------- PROD: Google redirect -----------
  const loginWithGoogle = () => {
    if (DEV_AUTH) {
      // У дев-режимі реальний редірект не потрібен
      console.warn("[DEV_AUTH] loginWithGoogle() викликано — ігноруємо редірект.");
      return;
    }
    // Використовуємо централізований GIS Code Flow з PKCE
    void startGoogleOAuth();
  };

  // ----------- PROD: Logout -----------
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Clear local auth state and tokens
      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      } catch {}

      setUser(null);
      saveStoredUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------- DEV-ONLY: миттєвий логін за роллю -----------
  // Видали цей блок у проді або вимкни через VITE_DEV_AUTH=0
  const loginAs = useCallback((role: Role) => {
    if (!DEV_AUTH) return;
    const fake: User = {
      id: `dev-${role}`,
      name: role.toUpperCase(),
      email: `${role}@dev.local`,
      role,
      status: "active",
    };
    setUser(fake);
    saveStoredUser(fake);
  }, []);

  const value: AuthCtx = useMemo(
    () => ({
      user,
      initializing,
      loading,
      loginWithGoogle,
      refreshMe,
      logout,
      ...(DEV_AUTH ? { loginAs } : {}), // у проді поля loginAs не буде
    }),
    [user, initializing, loading, loginWithGoogle, refreshMe, logout, loginAs]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
