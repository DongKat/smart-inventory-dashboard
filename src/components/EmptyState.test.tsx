import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders empty message', () => {
    render(<EmptyState onClearFilters={vi.fn()} />);
    expect(screen.getByText('No vehicles match your filters')).toBeInTheDocument();
  });

  it('renders clear filters button', () => {
    render(<EmptyState onClearFilters={vi.fn()} />);
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
  });

  it('calls onClearFilters when button clicked', () => {
    const onClear = vi.fn();
    render(<EmptyState onClearFilters={onClear} />);
    fireEvent.click(screen.getByText('Clear all filters'));
    expect(onClear).toHaveBeenCalledOnce();
  });
});
