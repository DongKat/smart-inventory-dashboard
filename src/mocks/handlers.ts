import { http, HttpResponse, delay } from 'msw';
import vehiclesData from './data/vehicles.json';

const locations = [
  { id: 'main-lot', name: 'Main Lot' },
  { id: 'downtown', name: 'Downtown Branch' },
  { id: 'westside', name: 'Westside Annex' },
  { id: 'airport', name: 'Airport Location' },
];

export const handlers = [
  http.get('/api/vehicles', async () => {
    await delay(Math.random() * 300 + 200);
    return HttpResponse.json({
      vehicles: vehiclesData,
      total: vehiclesData.length,
    });
  }),

  http.get('/api/vehicles/:id', async ({ params }) => {
    await delay(Math.random() * 200 + 100);
    const vehicle = vehiclesData.find((v) => v.id === params.id);
    if (!vehicle) {
      return HttpResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    return HttpResponse.json(vehicle);
  }),

  http.get('/api/locations', async () => {
    await delay(100);
    return HttpResponse.json({ locations });
  }),
];
