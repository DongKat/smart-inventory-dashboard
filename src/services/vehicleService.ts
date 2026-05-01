import type { Vehicle, VehiclesResponse, Location, LocationsResponse } from '@/types/vehicle';

export async function fetchVehicles(): Promise<Vehicle[]> {
  const response = await fetch('/api/vehicles');
  if (!response.ok) {
    throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
  }
  const data: VehiclesResponse = await response.json();
  return data.vehicles;
}

export async function fetchLocations(): Promise<Location[]> {
  const response = await fetch('/api/locations');
  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.statusText}`);
  }
  const data: LocationsResponse = await response.json();
  return data.locations;
}
