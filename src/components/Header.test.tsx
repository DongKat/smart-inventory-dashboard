import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders dashboard title', () => {
    render(<Header />);
    expect(screen.getByText('AutoResell Pro')).toBeInTheDocument();
  });

  it('shows branch indicator', () => {
    render(<Header />);
    expect(screen.getByText(/Main Branch/)).toBeInTheDocument();
  });
});
