import { describe, it, expect } from 'vitest';
import { paginate } from './usePagination';

describe('paginate', () => {
  const items = Array.from({ length: 50 }, (_, i) => i + 1);

  it('returns first page correctly', () => {
    const result = paginate(items, { currentPage: 1, pageSize: 25, totalItems: 50 });
    expect(result.paginatedItems).toHaveLength(25);
    expect(result.paginatedItems[0]).toBe(1);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(2);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
  });

  it('returns second page correctly', () => {
    const result = paginate(items, { currentPage: 2, pageSize: 25, totalItems: 50 });
    expect(result.paginatedItems).toHaveLength(25);
    expect(result.paginatedItems[0]).toBe(26);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
  });

  it('clamps page to valid range', () => {
    const result = paginate(items, { currentPage: 99, pageSize: 25, totalItems: 50 });
    expect(result.currentPage).toBe(2);
  });

  it('handles empty items', () => {
    const result = paginate([], { currentPage: 1, pageSize: 25, totalItems: 0 });
    expect(result.paginatedItems).toHaveLength(0);
    expect(result.totalPages).toBe(1);
  });
});
