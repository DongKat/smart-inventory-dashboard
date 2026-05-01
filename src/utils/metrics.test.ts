import { describe, it, expect } from 'vitest';
import type { VehicleWithAge } from '@/types/vehicle';
import { computeKpis, computeAgeDistribution, computeLocationBreakdown } from './metrics';

function makeVehicle(overrides: Partial<VehicleWithAge> = {}): VehicleWithAge {
  return {
    id: '1',
    vin: 'VIN001',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    trim: 'SE',
    price: 25000,
    location: 'main-lot',
    dateAcquired: '2024-10-01',
    status: 'available',
    mileage: 15000,
    exteriorColor: 'White',
    daysInStock: 30,
    isAging: false,
    ...overrides,
  };
}

describe('metrics utilities', () => {
  const vehicles: VehicleWithAge[] = [
    makeVehicle({ id: '1', price: 20000, daysInStock: 30, isAging: false, location: 'main-lot' }),
    makeVehicle({ id: '2', price: 30000, daysInStock: 100, isAging: true, location: 'main-lot' }),
    makeVehicle({ id: '3', price: 50000, daysInStock: 200, isAging: true, location: 'downtown' }),
  ];

  describe('computeKpis', () => {
    it('returns zeros for empty array', () => {
      const kpis = computeKpis([]);
      expect(kpis.totalVehicles).toBe(0);
      expect(kpis.agingVehicles).toBe(0);
      expect(kpis.agingPercentage).toBe(0);
      expect(kpis.averageDaysInStock).toBe(0);
      expect(kpis.totalInventoryValue).toBe(0);
    });

    it('computes totals correctly', () => {
      const kpis = computeKpis(vehicles);
      expect(kpis.totalVehicles).toBe(3);
      expect(kpis.agingVehicles).toBe(2);
      expect(kpis.agingPercentage).toBe(67);
      expect(kpis.averageDaysInStock).toBe(110);
      expect(kpis.totalInventoryValue).toBe(100000);
    });
  });

  describe('computeAgeDistribution', () => {
    it('places vehicles in correct buckets', () => {
      const buckets = computeAgeDistribution(vehicles);
      expect(buckets.find((b) => b.label === '0-30')!.count).toBe(1);
      expect(buckets.find((b) => b.label === '91-120')!.count).toBe(1);
      expect(buckets.find((b) => b.label === '180+')!.count).toBe(1);
    });

    it('returns all six buckets', () => {
      expect(computeAgeDistribution([])).toHaveLength(6);
    });
  });

  describe('computeLocationBreakdown', () => {
    it('groups by location with aging counts', () => {
      const breakdown = computeLocationBreakdown(vehicles);
      expect(breakdown).toHaveLength(2);

      const mainLot = breakdown.find((b) => b.location === 'main-lot')!;
      expect(mainLot.total).toBe(2);
      expect(mainLot.aging).toBe(1);

      const downtown = breakdown.find((b) => b.location === 'downtown')!;
      expect(downtown.total).toBe(1);
      expect(downtown.aging).toBe(1);
    });
  });
});
