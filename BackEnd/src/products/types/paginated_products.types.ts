import { Product } from '@prisma/client';

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  lastPage: number;
}