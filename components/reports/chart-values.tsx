'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartValuesProps {
  data: { date: string; total: number }[];
}

export function ChartValues({ data }: ChartValuesProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(val) => `R$ ${val}`} />
        <Tooltip formatter={(value) => `R$ ${value}`} />
        <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
