import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import type { AgeDistributionBucket } from '@/utils/metrics';

interface AgeDistributionChartProps {
  data: AgeDistributionBucket[];
}

const COLORS: Record<string, string> = {
  '0-30': '#3b82f6',
  '31-60': '#6366f1',
  '61-90': '#f59e0b',
  '90+': '#ef4444',
};

function AgeDistributionChart({ data }: AgeDistributionChartProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="mb-4 text-sm font-medium text-slate-700">Age Distribution (Days in Stock)</h3>
        <div className="h-64" data-testid="age-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                labelFormatter={(label) => `${label} days`}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={COLORS[entry.label] ?? '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default AgeDistributionChart;
