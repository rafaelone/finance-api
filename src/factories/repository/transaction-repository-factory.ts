import { TransactionRepository } from '@/repositories/transaction-repository';

import { makePrismaClient } from '../prisma-client-factory';

export function makeTransactionRepository() {
  return new TransactionRepository(makePrismaClient());
}
