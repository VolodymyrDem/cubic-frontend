// src/pages/AdminLogin.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineSpinner } from "@/components/Spinner";
import { toast } from "sonner";
import { adminLogin } from "@/lib/auth";

const AdminLogin: React.FC = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const sp = new URLSearchParams(loc.search);
  const next = sp.get("next") || "/admin/dashboard";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await adminLogin(email, password);
      toast.success('Успішний вхід!');
      
      // Navigate to admin dashboard
      nav(next, { replace: true });
      
      // Refresh the page to update auth context
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Помилка входу');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="max-w-md w-full border-none bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle>Вхід для адміністратора</CardTitle>
          <CardDescription>
            Увійдіть використовуючи email та пароль
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Пароль
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12"
              size="lg"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2 justify-center">
                  <InlineSpinner /> Вхід...
                </span>
              ) : (
                'Увійти'
              )}
            </Button>

            {/* Back to regular login */}
            <div className="text-center text-sm text-muted-foreground">
              <a href="/login" className="text-primary hover:underline font-medium">
                Повернутись до звичайного входу
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

