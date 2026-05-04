import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AgeDistributionChart from './AgeDistributionChart';
import type { AgeDistributionBucket } from '@/utils/metrics';

const mockData: AgeDistributionBucket[] = [
  { label: '0-30', count: 40 },
  { label: '31-60', count: 30 },
  { label: '61-90', count: 35 },
  { label: '90+', count: 45 },
];

describe('AgeDistributionChart', () => {
  it('renders chart container', () => {
    render(<AgeDistributionChart data={mockData} />);
    expect(screen.getByTestId('age-chart')).toBeInTheDocument();
  });

  it('renders chart title', () => {
    render(<AgeDistributionChart data={mockData} />);
    expect(screen.getByText('Age Distribution (Days in Stock)')).toBeInTheDocument();
  });
});
