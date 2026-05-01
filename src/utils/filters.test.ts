import { describe, it, expect } from 'vitest';
import type { VehicleWithAge } from '@/types/vehicle';
import { filterBySearch, filterByLocation, filterByAgingStatus, applyAllFilters } from './filters';

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

describe('filter utilities', () => {
  const vehicles: VehicleWithAge[] = [
    makeVehicle({ id: '1', make: 'Toyota', model: 'Camry', location: 'main-lot', daysInStock: 30, isAging: false }),
    makeVehicle({ id: '2', make: 'Honda', model: 'Civic', location: 'downtown', daysInStock: 100, isAging: true }),
    makeVehicle({ id: '3', make: 'Ford', model: 'F-150', location: 'main-lot', daysInStock: 200, isAging: true, year: 2024 }),
  ];

  describe('filterBySearch', () => {
    it('returns all when query is empty', () => {
      expect(filterBySearch(vehicles, '')).toHaveLength(3);
    });

    it('filters by make', () => {
      expect(filterBySearch(vehicles, 'Toyota')).toHaveLength(1);
    });

    it('filters by model', () => {
      expect(filterBySearch(vehicles, 'civic')).toHaveLength(1);
    });

    it('filters by year', () => {
      expect(filterBySearch(vehicles, '2024')).toHaveLength(1);
    });

    it('is case-insensitive', () => {
      expect(filterBySearch(vehicles, 'HONDA')).toHaveLength(1);
    });
  });

  describe('filterByLocation', () => {
    it('returns all when location is empty', () => {
      expect(filterByLocation(vehicles, '')).toHaveLength(3);
    });

    it('filters to matching location', () => {
      expect(filterByLocation(vehicles, 'main-lot')).toHaveLength(2);
    });
  });

  describe('filterByAgingStatus', () => {
    it('returns all when agingOnly is false', () => {
      expect(filterByAgingStatus(vehicles, false)).toHaveLength(3);
    });

    it('returns only aging vehicles', () => {
      expect(filterByAgingStatus(vehicles, true)).toHaveLength(2);
    });
  });

  describe('applyAllFilters', () => {
    it('combines all filters', () => {
      const result = applyAllFilters(vehicles, 'Ford', 'main-lot', true);
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe('3');
    });

    it('returns all when no filters active', () => {
      expect(applyAllFilters(vehicles, '', '', false)).toHaveLength(3);
    });
  });
});
