import type { TransactionType } from '@prisma/client';

import type { ITransaction } from './transaction';

export interface ITransactionRepository {
  getBalance(userId: string): Promise<number>;
  getTotalExpenses(userId: string): Promise<number>;
  getTotalRevenue(userId: string): Promise<number>;
  getAllTransactions(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<ITransaction[]>;
  create: (
    userId: string,
    name: string,
    type: TransactionType,
    value: number,
  ) => Promise<void>;
  update: (
    transactionId: string,
    name: string,
    type: TransactionType,
    value: number,
  ) => Promise<void>;

  delete: (transactionId: string) => Promise<void>;
}
