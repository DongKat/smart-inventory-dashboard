import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders dashboard title', () => {
    render(<Header />);
    expect(screen.getByText('Smart Inventory Dashboard')).toBeInTheDocument();
  });

  it('shows demo mode indicator', () => {
    render(<Header />);
    expect(screen.getByText('Demo Mode')).toBeInTheDocument();
  });
});
