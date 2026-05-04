import type { VehicleWithAge } from '@/types/vehicle';
import type { AgeRange } from '@/stores/inventoryStore';

export function filterBySearch(vehicles: VehicleWithAge[], query: string): VehicleWithAge[] {
  if (!query.trim()) return vehicles;
  const lower = query.toLowerCase();
  return vehicles.filter(
    (v) =>
      v.make.toLowerCase().includes(lower) ||
      v.model.toLowerCase().includes(lower) ||
      v.vin.toLowerCase().includes(lower) ||
      v.year.toString().includes(lower),
  );
}

export function filterByLocation(vehicles: VehicleWithAge[], location: string): VehicleWithAge[] {
  if (!location) return vehicles;
  return vehicles.filter((v) => v.location === location);
}

export function filterByMake(vehicles: VehicleWithAge[], make: string): VehicleWithAge[] {
  if (!make) return vehicles;
  return vehicles.filter((v) => v.make === make);
}

export function filterByAgeRange(vehicles: VehicleWithAge[], range: AgeRange): VehicleWithAge[] {
  if (!range) return vehicles;
  switch (range) {
    case '0-30':
      return vehicles.filter((v) => v.daysInStock <= 30);
    case '31-60':
      return vehicles.filter((v) => v.daysInStock >= 31 && v.daysInStock <= 60);
    case '61-90':
      return vehicles.filter((v) => v.daysInStock >= 61 && v.daysInStock <= 90);
    case '91-180':
      return vehicles.filter((v) => v.daysInStock >= 91 && v.daysInStock <= 180);
    case '180+':
      return vehicles.filter((v) => v.daysInStock > 180);
    default:
      return vehicles;
  }
}

export function filterByAgingStatus(
  vehicles: VehicleWithAge[],
  agingOnly: boolean,
): VehicleWithAge[] {
  if (!agingOnly) return vehicles;
  return vehicles.filter((v) => v.isAging);
}

export function applyAllFilters(
  vehicles: VehicleWithAge[],
  searchQuery: string,
  locationFilter: string,
  agingOnly: boolean,
  makeFilter?: string,
  ageRange?: AgeRange,
): VehicleWithAge[] {
  let result = vehicles;
  result = filterBySearch(result, searchQuery);
  result = filterByLocation(result, locationFilter);
  result = filterByMake(result, makeFilter ?? '');
  result = filterByAgeRange(result, ageRange ?? '');
  result = filterByAgingStatus(result, agingOnly);
  return result;
}
