import type { ICategory, ICategorySpend } from '../category/category';

export interface ICategoryUseCases {
  create: (userId: string, name: string) => Promise<void>;
  update: (categoryId: string, name: string, userId: string) => Promise<void>;
  get: (
    userId: string,
    limit?: number,
    offset?: number,
  ) => Promise<ICategory[]>;
  getTotalSpended: (
    userId: string,
    limit?: number,
    offset?: number,
  ) => Promise<ICategorySpend>;
  delete: (categoryId: string) => Promise<void>;
}
