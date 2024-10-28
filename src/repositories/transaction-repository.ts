import type { PrismaClient, TransactionType } from '@prisma/client';

import type { ITransaction } from '@/protocols/transaction/transaction';
import type { ITransactionRepository } from '@/protocols/transaction/transaction-repository';
import { formatData } from '@/utils/formatData';

export class TransactionRepository implements ITransactionRepository {
  private prismaTransactionClient;

  constructor(private readonly prismaClient: PrismaClient) {
    this.prismaTransactionClient = this.prismaClient.transaction;
  }

  async getAllTransactions(
    userId: string,
    limit: number = 12,
    offset: number = 0,
  ): Promise<ITransaction[]> {
    const response = await this.prismaTransactionClient.findMany({
      where: {
        userId,
      },
      take: limit,
      skip: offset,
    });

    const transactions = response.map((transaction) => ({
      ...transaction,
      createdAt: formatData(transaction.createdAt.toString()),
      updatedAt: formatData(transaction.updatedAt.toString()),
    }));

    return transactions;
  }

  async getTotalExpenses(userId: string): Promise<number> {
    const transactions = await this.prismaTransactionClient.findMany({
      where: {
        userId,
        type: 'WITHDRAW',
      },
    });

    const expense = transactions.reduce((acc, total) => acc + total.value, 0);

    return expense;
  }

  async getTotalRevenue(userId: string): Promise<number> {
    const transactions = await this.prismaTransactionClient.findMany({
      where: {
        userId,
        type: 'DEPOSIT',
      },
    });

    const revenue = transactions.reduce((acc, total) => acc + total.value, 0);

    return revenue;
  }

  async getBalance(userId: string): Promise<number> {
    const revenues = await this.getTotalRevenue(userId);
    const expenses = await this.getTotalExpenses(userId);

    return revenues - expenses;
  }

  async create(
    userId: string,
    name: string,
    type: TransactionType,
    value: number,
  ): Promise<void> {
    await this.prismaTransactionClient.create({
      data: {
        userId,
        name,
        type,
        value,
      },
    });
  }

  async delete(transactionId: string): Promise<void> {
    await this.prismaTransactionClient.delete({
      where: {
        id: transactionId,
      },
    });
  }

  async update(
    transactionId: string,
    name: string,
    type: TransactionType,
    value: number,
  ): Promise<void> {
    await this.prismaTransactionClient.update({
      where: {
        id: transactionId,
      },
      data: {
        name,
        type,
        value,
      },
    });
  }
}
