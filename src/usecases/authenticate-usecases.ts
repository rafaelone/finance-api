// sign
// signup

import type { UserRepository } from '@/repositories/user-repository';

// Protocols do repository
interface IUserRepositoryGetUser {
  findById: (id: string) => Promise<any>;
}

// Fazer interface
export class AuthenticateUseCases {
  constructor(private readonly userRepository: IUserRepositoryGetUser) {}

  async signIn(id: string) {
    const user = this.userRepository.findById(id);

    if (!user) {
      throw new Error();
    }

    return user;
  }
}
