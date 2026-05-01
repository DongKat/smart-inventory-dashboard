import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AgingBadge from './AgingBadge';

describe('AgingBadge', () => {
  it('renders nothing for vehicles under 90 days', () => {
    const { container } = render(<AgingBadge daysInStock={30} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing at exactly 90 days', () => {
    const { container } = render(<AgingBadge daysInStock={90} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders Aging badge for 91-180 days', () => {
    render(<AgingBadge daysInStock={100} />);
    expect(screen.getByText('Aging')).toBeInTheDocument();
  });

  it('renders Critical badge for 181+ days', () => {
    render(<AgingBadge daysInStock={200} />);
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });
});
