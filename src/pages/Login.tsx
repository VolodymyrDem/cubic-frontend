import React, { useState } from "react";
import { useAuth, type Role } from "@/types/auth";
import { useLocation, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const nav = useNavigate(); const loc = useLocation() as any;

  return (
    <div className="max-w-md mx-auto card p-6">
      <div className="text-xl font-semibold mb-4">Вхід</div>
      <div className="space-y-3">
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Пароль" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="input" value={role} onChange={e=>setRole(e.target.value as Role)}>
          <option value="student">Студент</option>
          <option value="teacher">Викладач</option>
          <option value="admin">Адмін</option>
        </select>
        <button
          className="btn-primary w-full"
          disabled={loading}
          onClick={async () => {
            await login(email, password, role);
            const to = loc.state?.from?.pathname ?? "/";
            // розумний редірект у свій дашборд
            if (role === "student") return nav("/student/dashboard", { replace: true });
            if (role === "teacher") return nav("/teacher/dashboard", { replace: true });
            if (role === "admin") return nav("/admin/dashboard", { replace: true });
            nav(to, { replace: true });
          }}
        >
          {loading ? "Входимо..." : "Увійти"}
        </button>
      </div>
    </div>
  );
};

export default Login;
