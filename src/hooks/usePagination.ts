interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

interface PaginationResult<T> {
  paginatedItems: T[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

export function paginate<T>(items: T[], config: PaginationConfig): PaginationResult<T> {
  const { currentPage, pageSize, totalItems } = config;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    paginatedItems,
    totalPages,
    currentPage: safePage,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
    startIndex,
    endIndex,
  };
}
