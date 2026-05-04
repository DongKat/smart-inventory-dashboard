import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterBar from './FilterBar';

const defaultProps = {
  searchQuery: '',
  onSearchChange: vi.fn(),
  locationFilter: '',
  onLocationChange: vi.fn(),
  makeFilter: '',
  onMakeChange: vi.fn(),
  ageRange: '' as const,
  onAgeRangeChange: vi.fn(),
  agingOnly: false,
  onAgingToggle: vi.fn(),
  locations: [
    { id: 'main-lot', name: 'Main Lot' },
    { id: 'downtown', name: 'Downtown Branch' },
  ],
  makes: ['Toyota', 'Honda', 'Ford'],
  totalResults: 42,
};

describe('FilterBar', () => {
  it('renders search input', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByLabelText('Search vehicles')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing', () => {
    const onSearchChange = vi.fn();
    render(<FilterBar {...defaultProps} onSearchChange={onSearchChange} />);
    fireEvent.change(screen.getByLabelText('Search vehicles'), { target: { value: 'Toyota' } });
    expect(onSearchChange).toHaveBeenCalledWith('Toyota');
  });

  it('renders location select', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByLabelText('Filter by location')).toBeInTheDocument();
  });

  it('renders aging toggle button', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByLabelText('Toggle aging stock filter')).toBeInTheDocument();
  });

  it('toggles aging filter on click', () => {
    const onAgingToggle = vi.fn();
    render(<FilterBar {...defaultProps} onAgingToggle={onAgingToggle} />);
    fireEvent.click(screen.getByLabelText('Toggle aging stock filter'));
    expect(onAgingToggle).toHaveBeenCalledWith(true);
  });

  it('shows total results count', () => {
    render(<FilterBar {...defaultProps} totalResults={42} />);
    expect(screen.getByText('42 vehicles')).toBeInTheDocument();
  });

  it('shows clear button when filters active', () => {
    render(<FilterBar {...defaultProps} searchQuery="test" />);
    expect(screen.getByLabelText('Clear all filters')).toBeInTheDocument();
  });

  it('does not show clear button when no filters active', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.queryByLabelText('Clear all filters')).not.toBeInTheDocument();
  });

  it('renders make filter select', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByLabelText('Filter by make')).toBeInTheDocument();
  });

  it('renders age range filter select', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByLabelText('Filter by age range')).toBeInTheDocument();
  });

  it('shows clear button when make filter is active', () => {
    render(<FilterBar {...defaultProps} makeFilter="Toyota" />);
    expect(screen.getByLabelText('Clear all filters')).toBeInTheDocument();
  });

  it('shows clear button when age range filter is active', () => {
    render(<FilterBar {...defaultProps} ageRange="0-30" />);
    expect(screen.getByLabelText('Clear all filters')).toBeInTheDocument();
  });
});
