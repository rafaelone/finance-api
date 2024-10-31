import type { PrismaClient } from '@prisma/client';

import { CategoryRepository } from '@/repositories/category-repository';

const mockPrismaClient = {
  category: {
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

describe('Category repository', () => {
  let categoryRepository: CategoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryRepository(
      mockPrismaClient as unknown as PrismaClient,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new category', async () => {
    const categoryData = {
      userId: '123',
      name: 'Home',
    };

    await categoryRepository.create(categoryData.userId, categoryData.name);

    expect(mockPrismaClient.category.create).toHaveBeenCalledWith({
      data: categoryData,
    });
  });

  it('should delete a category', async () => {
    const category = {
      id: '1',
      userId: '123',
      name: 'Home',
    };

    await categoryRepository.delete(category.id);

    expect(mockPrismaClient.category.delete).toHaveBeenCalledWith({
      where: {
        id: category.id,
      },
    });
  });

  it('should update a category', async () => {
    const category = {
      id: '1',
      userId: '123',
      name: 'Home',
    };

    await categoryRepository.update(category.id, 'Market', category.userId);

    expect(mockPrismaClient.category.update).toHaveBeenCalledWith({
      where: {
        id: category.id,
        userId: category.userId,
      },
      data: {
        name: 'Market',
      },
    });
  });
  it('should get all categories', async () => {
    const categoriesMock = [
      {
        id: '1',
        name: 'Home',
        createdAt: 'OCT 21, 2024',
        updatedAt: 'OCT 21, 2024',
        userId: '123',
        transactions: [],
      },
    ];

    mockPrismaClient.category.findMany.mockReturnValueOnce(categoriesMock);

    const categories = await categoryRepository.get('123', 12, 0);

    expect(mockPrismaClient.category.findMany).toHaveBeenCalled();
    expect(categories).toEqual(categoriesMock);
  });
});
