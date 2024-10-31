import type { PrismaClient, TransactionType } from '@prisma/client';

import { TransactionRepository } from '@/repositories/transaction-repository';

const mockPrismaClient = {
  transaction: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

describe('Transaction Repository', () => {
  let transactionRepository: TransactionRepository;

  beforeEach(() => {
    transactionRepository = new TransactionRepository(
      mockPrismaClient as unknown as PrismaClient,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all transactions', async () => {
    const mockTransactions = [
      {
        id: '1',
        name: 'market',
        createdAt: 'Oct 31, 2024',
        updatedAt: 'Oct 31, 2024',
        userId: '2',
        type: 'WITHDRAW',
        date: '10/10/2024',
        value: 200,
        categoryId: '123',
      },
    ];

    mockPrismaClient.transaction.findMany.mockReturnValueOnce(mockTransactions);
    const transactions = await transactionRepository.getAllTransactions('2');

    expect(transactions).toEqual(mockTransactions);
  });
  it('should get total expenses ', async () => {
    const mockTransactions = [
      {
        id: '1',
        name: 'market',
        createdAt: 'Oct 31, 2024',
        updatedAt: 'Oct 31, 2024',
        userId: '2',
        type: 'WITHDRAW',
        date: '10/10/2024',
        value: 200,
        categoryId: '123',
      },
      {
        id: '2',
        name: 'window',
        createdAt: 'Oct 31, 2024',
        updatedAt: 'Oct 31, 2024',
        userId: '2',
        type: 'WITHDRAW',
        date: '10/10/2024',
        value: 1000,
        categoryId: '2',
      },
    ];

    mockPrismaClient.transaction.findMany.mockReturnValueOnce(mockTransactions);
    const expenses = await transactionRepository.getTotalExpenses('2');

    expect(expenses).toEqual(1200);
  });
  it('should get total revenues ', async () => {
    const mockTransactions = [
      {
        id: '1',
        name: 'payment',
        createdAt: 'Oct 31, 2024',
        updatedAt: 'Oct 31, 2024',
        userId: '2',
        type: 'DEPOSIT',
        date: '10/10/2024',
        value: 1000,
        categoryId: '123',
      },
      {
        id: '2',
        name: 'payment',
        createdAt: 'Oct 31, 2024',
        updatedAt: 'Oct 31, 2024',
        userId: '2',
        type: 'DEPOSIT',
        date: '10/10/2024',
        value: 1000,
        categoryId: '2',
      },
    ];

    mockPrismaClient.transaction.findMany.mockReturnValueOnce(mockTransactions);
    const revenues = await transactionRepository.getTotalRevenue('2');

    expect(revenues).toEqual(2000);
  });
  it('should get total balance ', async () => {
    jest.spyOn(transactionRepository, 'getTotalRevenue').mockResolvedValue(500);
    jest
      .spyOn(transactionRepository, 'getTotalExpenses')
      .mockResolvedValue(200);

    const result = await transactionRepository.getBalance('123');

    expect(result).toBe(300);
    expect(transactionRepository.getTotalRevenue).toHaveBeenCalledWith('123');
    expect(transactionRepository.getTotalExpenses).toHaveBeenCalledWith('123');
  });
  it('should create a new transaction', async () => {
    const transactionData = {
      userId: 'user123',
      name: 'Transaction 1',
      type: 'DEPOSIT' as TransactionType,
      value: 100,
      categoryId: 'cat1',
      date: '2024-10-31',
    };

    await transactionRepository.create(
      transactionData.userId,
      transactionData.name,
      transactionData.type,
      transactionData.value,
      transactionData.categoryId,
      transactionData.date,
    );

    expect(mockPrismaClient.transaction.create).toHaveBeenCalledWith({
      data: transactionData,
    });
  });
  it('should delete a transaction', async () => {
    const transactionId = '123';

    await transactionRepository.delete(transactionId);

    expect(mockPrismaClient.transaction.delete).toHaveBeenCalledWith({
      where: { id: transactionId },
    });
  });
  it('should update a transaction by id', async () => {
    const transactionId = 'trans1';
    const transactionData = {
      name: 'Updated Transaction',
      type: 'DEPOSIT' as TransactionType,
      value: 200,
    };

    await transactionRepository.update(
      transactionId,
      transactionData.name,
      transactionData.type,
      transactionData.value,
    );

    expect(mockPrismaClient.transaction.update).toHaveBeenCalledWith({
      where: { id: transactionId },
      data: transactionData,
    });
  });
});
