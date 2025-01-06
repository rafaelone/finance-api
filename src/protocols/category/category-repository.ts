import type { ICategory } from './category';

export interface ICategoryRepository {
  create: (userId: string, name: string) => Promise<void>;
  update: (categoryId: string, name: string, userId: string) => Promise<void>;
  get: (userId: string, limit: number, offset: number) => Promise<ICategory[]>;
  delete: (categoryId: string) => Promise<void>;
}
