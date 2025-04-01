'use client';

import { Card, CardContent } from '@/components/ui/card';

export function ReportChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
}
