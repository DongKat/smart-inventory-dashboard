import { Card, CardContent } from '@/components/ui/card';
import type { KpiData } from '@/utils/metrics';
import { Package, AlertTriangle, Clock, DollarSign } from 'lucide-react';

interface KpiCardsProps {
  kpis: KpiData;
}

const cards = [
  {
    key: 'totalVehicles',
    label: 'Total Vehicles',
    icon: Package,
    format: (v: number) => v.toLocaleString(),
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    key: 'agingVehicles',
    label: 'Aging Stock',
    icon: AlertTriangle,
    format: (v: number, kpi: KpiData) => `${v} (${kpi.agingPercentage}%)`,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    key: 'averageDaysInStock',
    label: 'Avg. Days in Stock',
    icon: Clock,
    format: (v: number) => `${v} days`,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    key: 'totalInventoryValue',
    label: 'Inventory Value',
    icon: DollarSign,
    format: (v: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v),
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
] as const;

function KpiCards({ kpis }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = kpis[card.key];
        return (
          <Card key={card.key}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="text-xl font-bold text-slate-900" data-testid={`kpi-${card.key}`}>
                  {card.format(value, kpis)}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default KpiCards;
