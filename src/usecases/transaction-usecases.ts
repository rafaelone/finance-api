import type { TransactionType } from '@prisma/client';

import type { ITransactionUseCases } from '@/protocols/authenticate/transaction-usecases';
import type { ITransaction } from '@/protocols/transaction/transaction';
import type { ITransactionRepository } from '@/protocols/transaction/transaction-repository';

export class TransactionUseCases implements ITransactionUseCases {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async create(
    userId: string,
    name: string,
    type: TransactionType,
    value: number,
    categoryId: string,
    date: string,
  ): Promise<void> {
    await this.transactionRepository.create(
      userId,
      name,
      type,
      value,
      categoryId,
      date,
    );
  }

  async update(
    userId: string,
    transactionId: string,
    name: string,
    type: TransactionType,
    value: number,
  ): Promise<void> {
    await this.transactionRepository.update(transactionId, name, type, value);
  }

  async get(
    userId: string,
    limit: number = 12,
    offset: number = 0,
  ): Promise<ITransaction[]> {
    const transactions = await this.transactionRepository.getAllTransactions(
      userId,
      limit,
      offset,
    );

    return transactions;
  }

  async delete(transactionId: string): Promise<void> {
    await this.transactionRepository.delete(transactionId);
  }

  async revenues(userId: string): Promise<number> {
    const revenue = await this.transactionRepository.getTotalRevenue(userId);
    return revenue;
  }

  async expenses(userId: string): Promise<number> {
    const expense = await this.transactionRepository.getTotalExpenses(userId);
    return expense;
  }

  async balance(userId: string): Promise<number> {
    const result = await this.transactionRepository.getBalance(userId);
    return result;
  }
}
