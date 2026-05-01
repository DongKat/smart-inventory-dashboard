import type { VehicleWithAge } from '@/types/vehicle';

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
): VehicleWithAge[] {
  let result = vehicles;
  result = filterBySearch(result, searchQuery);
  result = filterByLocation(result, locationFilter);
  result = filterByAgingStatus(result, agingOnly);
  return result;
}
