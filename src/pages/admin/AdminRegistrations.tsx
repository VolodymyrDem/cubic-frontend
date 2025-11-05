import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type RegItem = {
  request_id: string;
  email: string;
  first_name: string;
  last_name: string;
  patronymic?: string | null;
  requested_role: 'student' | 'teacher' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

const AdminRegistrations: React.FC = () => {
  const [items, setItems] = useState<RegItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleOverride, setRoleOverride] = useState<Record<string, 'student' | 'teacher' | 'admin'>>({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const token = localStorage.getItem('access_token') || '';

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/registrations?status_filter=pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    const role = roleOverride[id];
    await fetch(`${API_BASE_URL}/api/admin/registrations/${id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
    await load();
  };

  const reject = async (id: string) => {
    await fetch(`${API_BASE_URL}/api/admin/registrations/${id}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Заявки на реєстрацію</h1>
      <Card>
        <CardContent className="p-4">
          {loading ? (
            <div className="text-muted-foreground">Завантаження...</div>
          ) : items.length === 0 ? (
            <div className="text-muted-foreground">Немає заявок</div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.request_id} className="flex items-center justify-between gap-4 border rounded-lg p-3">
                  <div className="flex-1">
                    <div className="font-medium">{it.last_name} {it.first_name}{it.patronymic ? ` ${it.patronymic}` : ''}</div>
                    <div className="text-sm text-muted-foreground">{it.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      onValueChange={(v) => setRoleOverride((prev) => ({ ...prev, [it.request_id]: v as any }))}
                      defaultValue={it.requested_role}
                    >
                      <SelectTrigger className="w-36"><SelectValue placeholder="Роль" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Студент</SelectItem>
                        <SelectItem value="teacher">Вчитель</SelectItem>
                        <SelectItem value="admin">Адмін</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => approve(it.request_id)}>Підтвердити</Button>
                    <Button variant="destructive" onClick={() => reject(it.request_id)}>Відхилити</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRegistrations;
