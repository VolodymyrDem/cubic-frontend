// src/pages/Login.tsx
import React from "react";
import { useAuth } from "@/types/auth";

const Login: React.FC = () => {
  const { loginAs, loginWithGoogle } = useAuth();

  return (
    <div className="max-w-md mx-auto card p-6 text-center space-y-4">
      <div className="text-xl font-semibold mb-4">Вхід</div>

      {/* PROD-кейс — базова кнопка (працюватиме і в DEV) */}
      <button className="btn-primary w-full" onClick={loginWithGoogle}>
        Увійти через Google
      </button>

      {/* DEV-кнопки показуємо лише якщо є loginAs */}
      {loginAs ? (
        <>
          <div className="text-[var(--muted)] mt-2">DEV-швидкий вхід:</div>
          <button className="btn-primary w-full" onClick={() => loginAs("student")}>
            Зайти як студент
          </button>
          <button className="btn-primary w-full" onClick={() => loginAs("teacher")}>
            Зайти як викладач
          </button>
          <button className="btn-primary w-full" onClick={() => loginAs("admin")}>
            Зайти як адмін
          </button>
        </>
      ) : (
        <p className="text-[var(--muted)] text-sm">
          DEV-кнопки вимкнені (VITE_DEV_AUTH=0). Використовуйте Google-вхід.
        </p>
      )}
    </div>
  );
};

export default Login;
