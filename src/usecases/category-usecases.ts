import type { ICategoryUseCases } from '@/protocols/authenticate/category-usecases';
import type { ICategory } from '@/protocols/category/category';
import type { ICategoryRepository } from '@/protocols/category/category-repository';

export class CategoryUseCases implements ICategoryUseCases {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async create(userId: string, name: string): Promise<void> {
    await this.categoryRepository.create(userId, name);
  }

  async update(
    categoryId: string,
    name: string,
    userId: string,
  ): Promise<void> {
    await this.categoryRepository.update(categoryId, name, userId);
  }

  async get(
    userId: string,
    limit: number = 12,
    offset: number = 0,
  ): Promise<ICategory[]> {
    const response = await this.categoryRepository.get(userId, limit, offset);

    const categories = response.map((category) => ({
      ...category,
    }));

    return categories;
  }

  async delete(categoryId: string): Promise<void> {
    await this.categoryRepository.delete(categoryId);
  }
}
