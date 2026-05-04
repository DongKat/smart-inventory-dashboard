import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getActions, addAction, getActionsForVehicle } from './actionService';
import type { Action } from '@/types/action';

function makeAction(overrides: Partial<Action> = {}): Action {
  return {
    id: 'act-1',
    vehicleId: 'veh-1',
    type: 'price_reduction',
    notes: 'Reduced by $500',
    createdAt: '2025-01-15T10:00:00Z',
    managerName: 'John',
    ...overrides,
  };
}

describe('actionService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when no actions stored', () => {
    expect(getActions()).toEqual([]);
  });

  it('adds and retrieves an action', () => {
    const action = makeAction();
    addAction(action);
    const actions = getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]!.id).toBe('act-1');
  });

  it('filters actions by vehicle ID', () => {
    addAction(makeAction({ id: 'a1', vehicleId: 'veh-1' }));
    addAction(makeAction({ id: 'a2', vehicleId: 'veh-2' }));
    addAction(makeAction({ id: 'a3', vehicleId: 'veh-1' }));

    const result = getActionsForVehicle('veh-1');
    expect(result).toHaveLength(2);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('smart-inventory-actions', 'not json');
    expect(getActions()).toEqual([]);
  });

  it('handles localStorage write failure gracefully', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Should not throw
    expect(() => addAction(makeAction())).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to write'));

    spy.mockRestore();
    warnSpy.mockRestore();
  });

  it('handles localStorage completely unavailable', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    expect(getActions()).toEqual([]);

    spy.mockRestore();
  });
});
