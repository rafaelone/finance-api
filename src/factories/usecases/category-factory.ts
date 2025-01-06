import { CategoryUseCases } from '@/usecases/category-usecases';

import { makeCategoryRepository } from '../repository/category-repository.factory';

export function makeCategoryUseCases() {
  return new CategoryUseCases(makeCategoryRepository());
}
