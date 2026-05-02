import type { VehicleWithAge } from '@/types/vehicle';

export interface KpiData {
  totalVehicles: number;
  agingVehicles: number;
  agingPercentage: number;
  averageDaysInStock: number;
  totalInventoryValue: number;
}

export interface AgeDistributionBucket {
  label: string;
  count: number;
}

export interface LocationBreakdown {
  location: string;
  total: number;
  aging: number;
}

export function computeKpis(vehicles: VehicleWithAge[]): KpiData {
  const totalVehicles = vehicles.length;
  if (totalVehicles === 0) {
    return {
      totalVehicles: 0,
      agingVehicles: 0,
      agingPercentage: 0,
      averageDaysInStock: 0,
      totalInventoryValue: 0,
    };
  }
  const agingVehicles = vehicles.filter((v) => v.isAging).length;
  const agingPercentage = Math.round((agingVehicles / totalVehicles) * 100);
  const averageDaysInStock = Math.round(
    vehicles.reduce((sum, v) => sum + v.daysInStock, 0) / totalVehicles,
  );
  const totalInventoryValue = vehicles.reduce((sum, v) => sum + v.price, 0);
  return { totalVehicles, agingVehicles, agingPercentage, averageDaysInStock, totalInventoryValue };
}

export function computeAgeDistribution(vehicles: VehicleWithAge[]): AgeDistributionBucket[] {
  const buckets: AgeDistributionBucket[] = [
    { label: '0-30', count: 0 },
    { label: '31-60', count: 0 },
    { label: '61-90', count: 0 },
    { label: '90+', count: 0 },
  ];

  for (const v of vehicles) {
    if (v.daysInStock <= 30) buckets[0]!.count++;
    else if (v.daysInStock <= 60) buckets[1]!.count++;
    else if (v.daysInStock <= 90) buckets[2]!.count++;
    else buckets[3]!.count++;
  }

  return buckets;
}

export function computeLocationBreakdown(vehicles: VehicleWithAge[]): LocationBreakdown[] {
  const map = new Map<string, { total: number; aging: number }>();

  for (const v of vehicles) {
    const entry = map.get(v.location) ?? { total: 0, aging: 0 };
    entry.total++;
    if (v.isAging) entry.aging++;
    map.set(v.location, entry);
  }

  return Array.from(map.entries()).map(([location, data]) => ({
    location,
    total: data.total,
    aging: data.aging,
  }));
}
