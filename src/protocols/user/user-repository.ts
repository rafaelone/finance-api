import type { IUser } from './user';

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  createUser(name: string, email: string, password: string): Promise<void>;
}

export interface IUserRepositoryGetUser {
  findByEmail(email: string): Promise<IUser | null>;
  createUser: (name: string, email: string, password: string) => Promise<void>;
}
