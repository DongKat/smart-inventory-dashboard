import { describe, it, expect, beforeEach } from 'vitest';
import { useActionStore } from './actionStore';
import type { Action } from '@/types/action';

function makeAction(overrides: Partial<Action> = {}): Action {
  return {
    id: 'act-1',
    vehicleId: 'veh-1',
    type: 'price_reduction',
    notes: 'Test',
    createdAt: '2025-01-15T10:00:00Z',
    managerName: 'Jane',
    ...overrides,
  };
}

describe('actionStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useActionStore.setState({ actions: [] });
  });

  it('starts with empty actions', () => {
    expect(useActionStore.getState().actions).toEqual([]);
  });

  it('addAction appends to state', () => {
    useActionStore.getState().addAction(makeAction({ id: 'a1' }));
    expect(useActionStore.getState().actions).toHaveLength(1);
  });

  it('getActionsForVehicle filters correctly', () => {
    useActionStore.getState().addAction(makeAction({ id: 'a1', vehicleId: 'v1' }));
    useActionStore.getState().addAction(makeAction({ id: 'a2', vehicleId: 'v2' }));
    useActionStore.getState().addAction(makeAction({ id: 'a3', vehicleId: 'v1' }));

    const result = useActionStore.getState().getActionsForVehicle('v1');
    expect(result).toHaveLength(2);
  });
});
