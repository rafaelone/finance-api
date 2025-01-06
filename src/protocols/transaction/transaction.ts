import type { TransactionType } from '@prisma/client';

export interface ITransaction {
  id: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  type: TransactionType;
  value: number;
  userId: string | null;
  Category?: string;
}
