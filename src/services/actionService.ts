import type { Action } from '@/types/action';

const STORAGE_KEY = 'smart-inventory-actions';

interface StoredActions {
  version: number;
  actions: Action[];
}

function readFromStorage(): Action[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: StoredActions = JSON.parse(raw);
    return parsed.actions;
  } catch {
    return [];
  }
}

function writeToStorage(actions: Action[]): boolean {
  try {
    const data: StoredActions = { version: 1, actions };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    console.warn('Failed to write actions to localStorage. Storage may be full or unavailable.');
    return false;
  }
}

export function getActions(): Action[] {
  return readFromStorage();
}

export function addAction(action: Action): void {
  const actions = readFromStorage();
  actions.push(action);
  writeToStorage(actions);
}

export function getActionsForVehicle(vehicleId: string): Action[] {
  return readFromStorage().filter((a) => a.vehicleId === vehicleId);
}
