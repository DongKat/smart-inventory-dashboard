import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '@/mocks/server';
import { fetchVehicles, fetchLocations } from './vehicleService';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('vehicleService', () => {
  it('fetchVehicles returns vehicle array', async () => {
    const vehicles = await fetchVehicles();
    expect(Array.isArray(vehicles)).toBe(true);
    expect(vehicles.length).toBeGreaterThan(0);
    expect(vehicles[0]).toHaveProperty('id');
    expect(vehicles[0]).toHaveProperty('make');
    expect(vehicles[0]).toHaveProperty('vin');
  });

  it('fetchLocations returns location array', async () => {
    const locations = await fetchLocations();
    expect(Array.isArray(locations)).toBe(true);
    expect(locations.length).toBe(4);
    expect(locations[0]).toHaveProperty('id');
    expect(locations[0]).toHaveProperty('name');
  });
});
