const AGING_THRESHOLD_DAYS = 90;

export function computeDaysInStock(dateAcquired: string): number {
  const acquired = new Date(dateAcquired);
  const now = new Date();
  const diffMs = now.getTime() - acquired.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function isAgingVehicle(daysInStock: number): boolean {
  return daysInStock > AGING_THRESHOLD_DAYS;
}

export type AgingSeverity = 'normal' | 'warning' | 'critical';

export function getAgingSeverity(daysInStock: number): AgingSeverity {
  if (daysInStock > 180) return 'critical';
  if (daysInStock > AGING_THRESHOLD_DAYS) return 'warning';
  return 'normal';
}
