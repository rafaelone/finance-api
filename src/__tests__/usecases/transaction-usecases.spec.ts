import type { TransactionType } from '@prisma/client';

import type { ITransaction } from '@/protocols/transaction/transaction';
import type { ITransactionRepository } from '@/protocols/transaction/transaction-repository';
import { TransactionUseCases } from '@/usecases/transaction-usecases';

describe('TransactionUseCases', () => {
  const transactionRepositoryMock: jest.Mocked<ITransactionRepository> = {
    create: jest.fn(),
    update: jest.fn(),
    getAllTransactions: jest.fn(),
    delete: jest.fn(),
    getTotalRevenue: jest.fn(),
    getTotalExpenses: jest.fn(),
    getBalance: jest.fn(),
  };

  const transactionUseCases = new TransactionUseCases(
    transactionRepositoryMock,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call transactionRepository.create with correct parameters', async () => {
      const transactionData = {
        userId: 'user123',
        name: 'Transaction Name',
        type: 'DEPOSIT' as TransactionType,
        value: 100,
        categoryId: 'category123',
        date: '2024-10-31',
      };

      await transactionUseCases.create(
        transactionData.userId,
        transactionData.name,
        transactionData.type,
        transactionData.value,
        transactionData.categoryId,
        transactionData.date,
      );

      expect(transactionRepositoryMock.create).toHaveBeenCalledWith(
        transactionData.userId,
        transactionData.name,
        transactionData.type,
        transactionData.value,
        transactionData.categoryId,
        transactionData.date,
      );
    });
  });

  describe('update', () => {
    it('should call transactionRepository.update with correct parameters', async () => {
      const userId = 'user123';
      const transactionId = 'trans123';
      const name = 'Updated Transaction';
      const type = 'WITHDRAW' as TransactionType;
      const value = 200;

      await transactionUseCases.update(
        userId,
        transactionId,
        name,
        type,
        value,
      );

      expect(transactionRepositoryMock.update).toHaveBeenCalledWith(
        transactionId,
        name,
        type,
        value,
      );
    });
  });

  describe('get', () => {
    it('should call transactionRepository.getAllTransactions and return transactions', async () => {
      const userId = 'user123';
      const limit = 10;
      const offset = 5;
      const mockTransactions: ITransaction[] = [
        {
          id: '1',
          userId,
          name: 'Transaction 1',
          type: 'DEPOSIT',
          value: 100,
          createdAt: 'OCT 20, 2024',
          updatedAt: 'OCT 20, 2024',
        },
        {
          id: '2',
          userId,
          name: 'Transaction 2',
          type: 'WITHDRAW',
          value: 50,
          createdAt: 'OCT 20, 2024',
          updatedAt: 'OCT 20, 2024',
        },
      ];
      transactionRepositoryMock.getAllTransactions.mockResolvedValue(
        mockTransactions,
      );

      const result = await transactionUseCases.get(userId, limit, offset);

      expect(transactionRepositoryMock.getAllTransactions).toHaveBeenCalledWith(
        userId,
        limit,
        offset,
      );
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('delete', () => {
    it('should call transactionRepository.delete with correct parameter', async () => {
      const transactionId = 'trans123';

      await transactionUseCases.delete(transactionId);

      expect(transactionRepositoryMock.delete).toHaveBeenCalledWith(
        transactionId,
      );
    });
  });

  describe('revenues', () => {
    it('should call transactionRepository.getTotalRevenue and return the revenue', async () => {
      const userId = 'user123';
      const revenue = 500;
      transactionRepositoryMock.getTotalRevenue.mockResolvedValue(revenue);

      const result = await transactionUseCases.revenues(userId);

      expect(transactionRepositoryMock.getTotalRevenue).toHaveBeenCalledWith(
        userId,
      );
      expect(result).toBe(revenue);
    });
  });

  describe('expenses', () => {
    it('should call transactionRepository.getTotalExpenses and return the expenses', async () => {
      const userId = 'user123';
      const expense = 300;
      transactionRepositoryMock.getTotalExpenses.mockResolvedValue(expense);

      const result = await transactionUseCases.expenses(userId);

      expect(transactionRepositoryMock.getTotalExpenses).toHaveBeenCalledWith(
        userId,
      );
      expect(result).toBe(expense);
    });
  });

  describe('balance', () => {
    it('should call transactionRepository.getBalance and return the balance', async () => {
      const userId = 'user123';
      const balance = 200;
      transactionRepositoryMock.getBalance.mockResolvedValue(balance);

      const result = await transactionUseCases.balance(userId);

      expect(transactionRepositoryMock.getBalance).toHaveBeenCalledWith(userId);
      expect(result).toBe(balance);
    });
  });
});
