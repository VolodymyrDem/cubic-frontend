// src/pages/ClassroomDemo.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClassroomData from '@/components/ClassroomData';
import UserProfile from '@/components/UserProfile';
import JWTDebugger from '@/components/JWTDebugger';
import { useAuth } from '@/types/auth';

const ClassroomDemo: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Будь ласка, увійдіть у систему для перегляду Google Classroom даних.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Classroom Integration Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Ця сторінка демонструє інтеграцію з Google Classroom API.
            Після успішної авторизації ви зможете переглядати свої курси та дані.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <UserProfile />
          <JWTDebugger />
        </div>
        <div>
          <ClassroomData />
        </div>
      </div>
    </div>
  );
};

export default ClassroomDemo;