import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InventoryTable from './InventoryTable';
import type { VehicleWithAge } from '@/types/vehicle';

function makeVehicle(overrides: Partial<VehicleWithAge> = {}): VehicleWithAge {
  return {
    id: '1',
    vin: 'VIN001',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    trim: 'SE',
    price: 25000,
    location: 'main-lot',
    dateAcquired: '2024-10-01',
    status: 'available',
    mileage: 15000,
    exteriorColor: 'White',
    daysInStock: 30,
    isAging: false,
    ...overrides,
  };
}

const vehicles: VehicleWithAge[] = [
  makeVehicle({ id: '1', make: 'Toyota', model: 'Camry', price: 25000, daysInStock: 30, isAging: false }),
  makeVehicle({ id: '2', make: 'Honda', model: 'Civic', price: 22000, daysInStock: 100, isAging: true }),
  makeVehicle({ id: '3', make: 'Ford', model: 'F-150', price: 45000, daysInStock: 200, isAging: true }),
];

const defaultProps = {
  vehicles,
  sortField: 'daysInStock' as const,
  sortDirection: 'desc' as const,
  onSort: vi.fn(),
  currentPage: 1,
  onPageChange: vi.fn(),
  pageSize: 25,
};

describe('InventoryTable', () => {
  it('renders vehicle rows', () => {
    render(<InventoryTable {...defaultProps} />);
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('Honda Civic')).toBeInTheDocument();
    expect(screen.getByText('Ford F-150')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<InventoryTable {...defaultProps} />);
    expect(screen.getByText('Vehicle')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Days In Stock')).toBeInTheDocument();
  });

  it('calls onSort when column header clicked', () => {
    const onSort = vi.fn();
    render(<InventoryTable {...defaultProps} onSort={onSort} />);
    fireEvent.click(screen.getByText('Price'));
    expect(onSort).toHaveBeenCalledWith('price');
  });

  it('shows pagination info', () => {
    render(<InventoryTable {...defaultProps} />);
    expect(screen.getByText(/Showing 1–3 of 3/)).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(<InventoryTable {...defaultProps} currentPage={1} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('formats prices with currency', () => {
    render(<InventoryTable {...defaultProps} />);
    expect(screen.getByText('$25,000')).toBeInTheDocument();
  });

  it('shows action button only for aging vehicles', () => {
    const onRecordAction = vi.fn();
    render(<InventoryTable {...defaultProps} onRecordAction={onRecordAction} />);
    // aging vehicles (Honda Civic id=2, Ford F-150 id=3) should have action buttons
    const actionButtons = screen.getAllByRole('button', { name: /Record action for/ });
    expect(actionButtons).toHaveLength(2);
    expect(screen.getByLabelText('Record action for Honda Civic')).toBeInTheDocument();
    expect(screen.getByLabelText('Record action for Ford F-150')).toBeInTheDocument();
    // non-aging vehicle (Toyota Camry) should NOT have an action button
    expect(screen.queryByLabelText('Record action for Toyota Camry')).not.toBeInTheDocument();
  });

  it('highlights aging vehicle rows', () => {
    render(<InventoryTable {...defaultProps} />);
    const agingRow = screen.getByTestId('vehicle-row-2');
    expect(agingRow.className).toContain('bg-amber-50');
  });
});
