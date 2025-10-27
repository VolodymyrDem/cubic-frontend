// src/pages/admin/AdminRegistrationRequests.tsx
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Reveal from "@/components/Reveal";
import { InlineSpinner } from "@/components/Spinner";
import { 
  getRegistrationRequests, 
  approveRegistrationRequest, 
  declineRegistrationRequest,
  type RegistrationRequest 
} from "@/lib/adminApi";

const AdminRegistrationRequests: React.FC = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchRequests = async () => {
    try {
      const data = await getRegistrationRequests();
      setRequests(data);
    } catch (error: any) {
      toast.error(error.message || 'Помилка завантаження запитів');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRequests();
  }, []);

  const handleApprove = async (userId: string) => {
    setProcessingIds((prev: Set<string>) => new Set(prev).add(userId));
    
    try {
      await approveRegistrationRequest(userId);
      toast.success('Запит схвалено');
      
      // Remove from list
      setRequests((prev: RegistrationRequest[]) => prev.filter((req: RegistrationRequest) => req.user_id !== userId));
    } catch (error: any) {
      toast.error(error.message || 'Помилка при схваленні запиту');
    } finally {
      setProcessingIds((prev: Set<string>) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const handleDecline = async (userId: string) => {
    setProcessingIds((prev: Set<string>) => new Set(prev).add(userId));
    
    try {
      await declineRegistrationRequest(userId);
      toast.success('Запит відхилено');
      
      // Remove from list
      setRequests((prev: RegistrationRequest[]) => prev.filter((req: RegistrationRequest) => req.user_id !== userId));
    } catch (error: any) {
      toast.error(error.message || 'Помилка при відхиленні запиту');
    } finally {
      setProcessingIds((prev: Set<string>) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <InlineSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Reveal className="text-2xl font-semibold" delayMs={80} y={8} opacityFrom={1}>
        Запити на реєстрацію
      </Reveal>

      {requests.length === 0 ? (
        <Reveal delayMs={100} y={6} opacityFrom={1}>
          <Card className="border-none bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              Немає нових запитів на реєстрацію
            </CardContent>
          </Card>
        </Reveal>
      ) : (
        <div className="space-y-4">
          {requests.map((request: RegistrationRequest, idx: number) => (
            <Reveal key={request.user_id} delayMs={100 + idx * 50} y={6} opacityFrom={1}>
              <Card className="border-none bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {request.first_name} {request.last_name}
                        {request.patronymic && ` ${request.patronymic}`}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {request.email}
                      </div>
                    </div>
                    <Badge variant={request.role === "student" ? "default" : "secondary"}>
                      {request.role === "student" ? "Студент" : "Викладач"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Дата запиту: {formatDate(request.created_at)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecline(request.user_id)}
                        disabled={processingIds.has(request.user_id)}
                        className="text-destructive hover:text-destructive"
                      >
                        {processingIds.has(request.user_id) ? (
                          <span className="inline-flex items-center gap-2">
                            <InlineSpinner className="w-3 h-3" /> Обробка...
                          </span>
                        ) : (
                          'Відхилити'
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.user_id)}
                        disabled={processingIds.has(request.user_id)}
                      >
                        {processingIds.has(request.user_id) ? (
                          <span className="inline-flex items-center gap-2">
                            <InlineSpinner className="w-3 h-3" /> Обробка...
                          </span>
                        ) : (
                          'Схвалити'
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRegistrationRequests;

