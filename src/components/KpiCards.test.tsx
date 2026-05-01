import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import KpiCards from './KpiCards';
import type { KpiData } from '@/utils/metrics';

const mockKpis: KpiData = {
  totalVehicles: 150,
  agingVehicles: 45,
  agingPercentage: 30,
  averageDaysInStock: 75,
  totalInventoryValue: 4500000,
};

describe('KpiCards', () => {
  it('renders total vehicles', () => {
    render(<KpiCards kpis={mockKpis} />);
    expect(screen.getByTestId('kpi-totalVehicles')).toHaveTextContent('150');
  });

  it('renders aging vehicles with percentage', () => {
    render(<KpiCards kpis={mockKpis} />);
    expect(screen.getByTestId('kpi-agingVehicles')).toHaveTextContent('45 (30%)');
  });

  it('renders average days in stock', () => {
    render(<KpiCards kpis={mockKpis} />);
    expect(screen.getByTestId('kpi-averageDaysInStock')).toHaveTextContent('75 days');
  });

  it('renders inventory value formatted as currency', () => {
    render(<KpiCards kpis={mockKpis} />);
    expect(screen.getByTestId('kpi-totalInventoryValue')).toHaveTextContent('$4,500,000');
  });

  it('renders all 4 card labels', () => {
    render(<KpiCards kpis={mockKpis} />);
    expect(screen.getByText('Total Vehicles')).toBeInTheDocument();
    expect(screen.getByText('Aging Stock')).toBeInTheDocument();
    expect(screen.getByText('Avg. Days in Stock')).toBeInTheDocument();
    expect(screen.getByText('Inventory Value')).toBeInTheDocument();
  });
});
