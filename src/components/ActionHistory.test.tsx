import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ActionHistory from './ActionHistory';
import type { Action } from '@/types/action';

const mockActions: Action[] = [
  {
    id: 'a1',
    vehicleId: 'v1',
    type: 'price_reduction',
    notes: 'Reduced by $1000',
    createdAt: '2025-01-10T10:00:00Z',
    managerName: 'Jane',
  },
  {
    id: 'a2',
    vehicleId: 'v1',
    type: 'marketing_push',
    notes: '',
    createdAt: '2025-01-12T14:00:00Z',
    managerName: 'John',
  },
];

describe('ActionHistory', () => {
  it('renders empty state when no actions', () => {
    render(<ActionHistory actions={[]} />);
    expect(screen.getByText('No actions recorded yet.')).toBeInTheDocument();
  });

  it('renders action list', () => {
    render(<ActionHistory actions={mockActions} />);
    expect(screen.getByText('Price Reduction')).toBeInTheDocument();
    expect(screen.getByText('Marketing Push')).toBeInTheDocument();
  });

  it('displays action notes', () => {
    render(<ActionHistory actions={mockActions} />);
    expect(screen.getByText('Reduced by $1000')).toBeInTheDocument();
  });

  it('shows manager name', () => {
    render(<ActionHistory actions={mockActions} />);
    expect(screen.getByText(/Jane/)).toBeInTheDocument();
    expect(screen.getByText(/John/)).toBeInTheDocument();
  });
});
