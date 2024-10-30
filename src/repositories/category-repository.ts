import type { PrismaClient } from '@prisma/client';

import type { ICategoryRepository } from '@/protocols/category/category-repository';

export class CategoryRepository implements ICategoryRepository {
  private prismaCategoryClient;

  constructor(private readonly prismaClient: PrismaClient) {
    this.prismaCategoryClient = this.prismaClient.category;
  }

  async create(userId: string, name: string): Promise<void> {
    await this.prismaCategoryClient.create({
      data: {
        userId,
        name,
      },
    });
  }

  async delete(categoryId: string): Promise<void> {
    await this.prismaCategoryClient.delete({
      where: {
        id: categoryId,
      },
    });
  }

  async update(
    categoryId: string,
    name: string,
    userId: string,
  ): Promise<void> {
    await this.prismaCategoryClient.update({
      where: {
        id: categoryId,
        userId,
      },
      data: {
        name,
      },
    });
  }

  async get(userId: string, limit: number = 12, offset: number = 0) {
    const response = await this.prismaCategoryClient.findMany({
      take: limit,
      skip: offset,
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        transactions: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            type: true,
            value: true,
            userId: true,
          },
        },
      },
    });

    return response;
  }
}
