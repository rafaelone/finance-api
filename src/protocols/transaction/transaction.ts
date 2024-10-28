import type { TransactionType } from '@prisma/client';

export interface ITransaction {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  type: TransactionType;
  value: number;
  userId: string | null;
}
