import type { ICategoryUseCases } from '@/protocols/authenticate/category-usecases';
import type { ICategory, ICategorySpend } from '@/protocols/category/category';
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

  async getTotalSpended(
    userId: string,
    limit: number = 12,
    offset: number = 0,
  ): Promise<ICategorySpend> {
    const response = await this.categoryRepository.get(userId, limit, offset);

    const categories = response.map((category) => ({
      name: category.name,
      totalDeposit:
        category.transactions?.reduce(
          (acc, total) =>
            total.type === 'DEPOSIT' ? acc + total.value : acc + 0,
          0,
        ) ?? 0,
      totalWithdraw:
        category.transactions?.reduce(
          (acc, total) =>
            total.type === 'WITHDRAW' ? acc + total.value : acc + 0,
          0,
        ) ?? 0,
    }));

    const totalMoney = categories.reduce(
      (acc, total) => acc + total.totalDeposit + total.totalWithdraw,
      0,
    );

    const data = {
      totalMoney,
      categories: categories.map((category) => ({
        name: category.name,
        totalWithdraw: category.totalWithdraw,
        percentage: parseFloat(
          ((category.totalWithdraw / totalMoney) * 100).toFixed(2),
        ),
      })),
    };

    return data;
  }

  async delete(categoryId: string): Promise<void> {
    await this.categoryRepository.delete(categoryId);
  }
}
