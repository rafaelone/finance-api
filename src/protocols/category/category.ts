import type { ITransaction } from '../transaction/transaction';

export interface ICategory {
  id: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string | null;
  transactions?: ITransaction[];
}
