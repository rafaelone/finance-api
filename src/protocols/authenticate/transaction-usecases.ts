import type { TransactionType } from '@prisma/client';

import type { ITransaction } from '../transaction/transaction';

export interface ITransactionUseCases {
  create: (
    userId: string,
    name: string,
    type: TransactionType,
    value: number,
    categoryId: string,
    date: string,
  ) => Promise<void>;
  update: (
    userId: string,
    transactionId: string,
    name: string,
    type: TransactionType,
    value: number,
  ) => Promise<void>;
  get: (
    userId: string,
    limit?: number,
    offset?: number,
  ) => Promise<ITransaction[]>;

  delete: (transactionId: string) => Promise<void>;
  revenues: (userId: string) => Promise<number>;
  expenses: (userId: string) => Promise<number>;
  balance: (userId: string) => Promise<number>;
}
