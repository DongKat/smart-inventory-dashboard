import { create } from 'zustand';
import type { Vehicle, VehicleWithAge, Location } from '@/types/vehicle';
import { fetchVehicles, fetchLocations } from '@/services/vehicleService';
import { computeDaysInStock, isAgingVehicle } from '@/utils/aging';

export type SortField = 'make' | 'year' | 'price' | 'daysInStock' | 'location' | 'status';
export type SortDirection = 'asc' | 'desc';

interface InventoryState {
  vehicles: VehicleWithAge[];
  locations: Location[];
  isLoading: boolean;
  error: string | null;
  sortField: SortField;
  sortDirection: SortDirection;
  searchQuery: string;
  locationFilter: string;
  agingOnly: boolean;
  currentPage: number;
  pageSize: number;
  loadVehicles: () => Promise<void>;
  loadLocations: () => Promise<void>;
  setSortField: (field: SortField) => void;
  setSearchQuery: (query: string) => void;
  setLocationFilter: (location: string) => void;
  setAgingOnly: (aging: boolean) => void;
  setCurrentPage: (page: number) => void;
}

function enrichVehicle(vehicle: Vehicle): VehicleWithAge {
  const daysInStock = computeDaysInStock(vehicle.dateAcquired);
  return { ...vehicle, daysInStock, isAging: isAgingVehicle(daysInStock) };
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  vehicles: [],
  locations: [],
  isLoading: false,
  error: null,
  sortField: 'daysInStock',
  sortDirection: 'desc',
  searchQuery: '',
  locationFilter: '',
  agingOnly: false,
  currentPage: 1,
  pageSize: 25,

  loadVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const raw = await fetchVehicles();
      const vehicles = raw.map(enrichVehicle);
      set({ vehicles, isLoading: false });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Unknown error', isLoading: false });
    }
  },

  loadLocations: async () => {
    try {
      const locations = await fetchLocations();
      set({ locations });
    } catch {
      // locations are non-critical, silently fail
    }
  },

  setSortField: (field) => {
    const state = get();
    if (state.sortField === field) {
      set({ sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' });
    } else {
      set({ sortField: field, sortDirection: 'asc' });
    }
  },

  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setLocationFilter: (locationFilter) => set({ locationFilter, currentPage: 1 }),
  setAgingOnly: (agingOnly) => set({ agingOnly, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
}));
