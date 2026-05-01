import { create } from 'zustand';
import type { Action } from '@/types/action';
import { addAction as saveAction, getActions } from '@/services/actionService';

interface ActionState {
  actions: Action[];
  loadActions: () => void;
  addAction: (action: Action) => void;
  getActionsForVehicle: (vehicleId: string) => Action[];
}

export const useActionStore = create<ActionState>()((set, get) => ({
  actions: [],

  loadActions: () => {
    const actions = getActions();
    set({ actions });
  },

  addAction: (action) => {
    saveAction(action);
    set((state) => ({ actions: [...state.actions, action] }));
  },

  getActionsForVehicle: (vehicleId) => {
    return get().actions.filter((a) => a.vehicleId === vehicleId);
  },
}));
