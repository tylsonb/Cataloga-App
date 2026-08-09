export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  success: boolean;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};
