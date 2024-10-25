import type { AppErrorService } from '../app-error-services';

export interface IUSerService {
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ token: string; status: number } | AppErrorService>;
}
