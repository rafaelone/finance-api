import { CategoryRepository } from '@/repositories/category-repository';

import { makePrismaClient } from '../prisma-client-factory';

export function makeCategoryRepository() {
  return new CategoryRepository(makePrismaClient());
}
