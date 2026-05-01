export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  location: string;
  dateAcquired: string;
  status: VehicleStatus;
  mileage: number;
  exteriorColor: string;
}

export type VehicleStatus = 'available' | 'reserved' | 'sold';

export interface VehicleWithAge extends Vehicle {
  daysInStock: number;
  isAging: boolean;
}

export interface Location {
  id: string;
  name: string;
}

export interface VehiclesResponse {
  vehicles: Vehicle[];
  total: number;
}

export interface LocationsResponse {
  locations: Location[];
}
