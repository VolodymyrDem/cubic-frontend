import React, { useState } from "react";
import { useAuth, type Role } from "@/types/auth";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const { register, loading } = useAuth();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const nav = useNavigate();

  return (
    <div className="max-w-md mx-auto card p-6">
      <div className="text-xl font-semibold mb-4">Реєстрація</div>
      <div className="space-y-3">
        <input className="input" placeholder="Ім’я" value={name} onChange={e=>setName(e.target.value)} />
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
            await register(name, email, password, role);
            nav("/"); // далі користувача зустріне головна з плитками його ролі
          }}
        >
          {loading ? "Реєструємо..." : "Зареєструватися"}
        </button>
      </div>
    </div>
  );
};

export default Register;
