import type { ICategory } from '@/protocols/category/category';
import type { ICategoryRepository } from '@/protocols/category/category-repository';
import { CategoryUseCases } from '@/usecases/category-usecases';

describe('CategoryUseCases', () => {
  const categoryRepositoryMock: jest.Mocked<ICategoryRepository> = {
    create: jest.fn(),
    update: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  };

  const categoryUseCases = new CategoryUseCases(categoryRepositoryMock);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call categoryRepository.create with correct parameters', async () => {
      const userId = 'user123';
      const name = 'Category Name';

      await categoryUseCases.create(userId, name);

      expect(categoryRepositoryMock.create).toHaveBeenCalledWith(userId, name);
    });
  });

  describe('update', () => {
    it('should call categoryRepository.update with correct parameters', async () => {
      const categoryId = 'cat123';
      const name = 'Updated Category';
      const userId = 'user123';

      await categoryUseCases.update(categoryId, name, userId);

      expect(categoryRepositoryMock.update).toHaveBeenCalledWith(
        categoryId,
        name,
        userId,
      );
    });
  });

  describe('get', () => {
    it('should call categoryRepository.get with correct parameters and return mapped categories', async () => {
      const userId = 'user123';
      const limit = 12;
      const offset = 0;

      const mockCategories: ICategory[] = [
        {
          id: '1',
          name: 'Category 1',
          createdAt: 'OCT 20, 2024',
          updatedAt: 'OCT 20, 2024',
          userId: '123',
          transactions: [],
        },
      ];
      categoryRepositoryMock.get.mockResolvedValue(mockCategories);

      const result = await categoryUseCases.get(userId, limit, offset);

      expect(categoryRepositoryMock.get).toHaveBeenCalledWith(
        userId,
        limit,
        offset,
      );
      expect(result).toEqual(mockCategories);
    });
  });

  describe('delete', () => {
    it('should call categoryRepository.delete with correct parameters', async () => {
      const categoryId = 'cat123';

      await categoryUseCases.delete(categoryId);

      expect(categoryRepositoryMock.delete).toHaveBeenCalledWith(categoryId);
    });
  });
});
