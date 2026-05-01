import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { useInventoryStore } from './inventoryStore';
import { server } from '@/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('inventoryStore', () => {
  beforeEach(() => {
    useInventoryStore.setState({
      vehicles: [],
      locations: [],
      isLoading: false,
      error: null,
      searchQuery: '',
      locationFilter: '',
      agingOnly: false,
      currentPage: 1,
    });
  });

  it('starts with empty vehicles and loading false', () => {
    const state = useInventoryStore.getState();
    expect(state.vehicles).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('loadVehicles populates vehicles with age data', async () => {
    await useInventoryStore.getState().loadVehicles();
    const state = useInventoryStore.getState();
    expect(state.vehicles.length).toBeGreaterThan(0);
    expect(state.vehicles[0]).toHaveProperty('daysInStock');
    expect(state.vehicles[0]).toHaveProperty('isAging');
    expect(state.isLoading).toBe(false);
  });

  it('loadLocations populates locations', async () => {
    await useInventoryStore.getState().loadLocations();
    const state = useInventoryStore.getState();
    expect(state.locations).toHaveLength(4);
  });

  it('setSortField toggles direction on same field', () => {
    const store = useInventoryStore.getState();
    store.setSortField('price');
    expect(useInventoryStore.getState().sortField).toBe('price');
    expect(useInventoryStore.getState().sortDirection).toBe('asc');

    useInventoryStore.getState().setSortField('price');
    expect(useInventoryStore.getState().sortDirection).toBe('desc');
  });

  it('setSearchQuery resets page to 1', () => {
    useInventoryStore.setState({ currentPage: 3 });
    useInventoryStore.getState().setSearchQuery('test');
    expect(useInventoryStore.getState().currentPage).toBe(1);
    expect(useInventoryStore.getState().searchQuery).toBe('test');
  });
});
