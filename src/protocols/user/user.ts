import type { ITransaction } from '../transaction/transaction';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  transactions: ITransaction[];
}
