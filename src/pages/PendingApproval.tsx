import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Hourglass } from 'lucide-react';

const PendingApproval: React.FC = () => {
  const location = useLocation() as any;
  const message = location.state?.message as string | undefined;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6 text-center space-y-4">
          <Hourglass className="h-12 w-12 mx-auto text-primary" />
          <h1 className="text-2xl font-semibold">Заявка на реєстрацію на розгляді</h1>
          <p className="text-muted-foreground">
            {message || 'Будь ласка, зачекайте. Адміністратор має підтвердити вашу заявку. Після підтвердження ви зможете увійти.'}
          </p>
          <div className="pt-2">
            <Link to="/" className="text-primary hover:underline">Повернутись на головну</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
