import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionDrawer from './ActionDrawer';
import type { VehicleWithAge } from '@/types/vehicle';

const mockVehicle: VehicleWithAge = {
  id: 'v1',
  vin: 'VIN001',
  make: 'Toyota',
  model: 'Camry',
  year: 2023,
  trim: 'SE',
  price: 25000,
  location: 'main-lot',
  dateAcquired: '2024-06-01',
  status: 'available',
  mileage: 15000,
  exteriorColor: 'White',
  daysInStock: 200,
  isAging: true,
};

describe('ActionDrawer', () => {
  it('renders dialog when open', () => {
    render(<ActionDrawer vehicle={mockVehicle} open={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByText('Record Action')).toBeInTheDocument();
  });

  it('shows vehicle info in description', () => {
    render(<ActionDrawer vehicle={mockVehicle} open={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByText(/Toyota Camry/)).toBeInTheDocument();
    expect(screen.getByText(/200 days in stock/)).toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(<ActionDrawer vehicle={mockVehicle} open={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByText('Action Type')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Save Action')).toBeInTheDocument();
  });

  it('shows validation error when no type selected', () => {
    render(<ActionDrawer vehicle={mockVehicle} open={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByText('Save Action'));
    expect(screen.getByText('Please select an action type')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<ActionDrawer vehicle={mockVehicle} open={false} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.queryByText('Record Action')).not.toBeInTheDocument();
  });
});
