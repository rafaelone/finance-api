import { TransactionUseCases } from '@/usecases/transaction-usecases';

import { makeTransactionRepository } from '../repository/transaction-repository-factory';

export function makeTransactionUseCases() {
  return new TransactionUseCases(makeTransactionRepository());
}
