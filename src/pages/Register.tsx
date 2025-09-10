// src/pages/Register.tsx
import React from "react";
import { useAuth } from "@/types/auth";


const Register: React.FC = () => {
const { loginWithGoogle, loading } = useAuth();
return (
<div className="max-w-md mx-auto card p-6 text-center">
<div className="text-xl font-semibold mb-2">Реєстрація</div>
<p className="text-[var(--muted)] mb-4">Реєстрація відбувається через Google. Після входу виберіть свою роль.</p>
<button className="btn-primary w-full" disabled={loading} onClick={loginWithGoogle}>
Продовжити з Google
</button>
</div>
);
};


export default Register;