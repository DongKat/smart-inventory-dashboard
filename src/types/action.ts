export interface Action {
  id: string;
  vehicleId: string;
  type: ActionType;
  notes: string;
  createdAt: string;
  managerName: string;
}

export type ActionType = 'price_reduction' | 'transfer' | 'marketing_push' | 'other';

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  price_reduction: 'Price Reduction',
  transfer: 'Transfer',
  marketing_push: 'Marketing Push',
  other: 'Other',
};
