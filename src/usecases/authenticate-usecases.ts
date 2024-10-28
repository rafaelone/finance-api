import { compare, hash } from 'bcryptjs';

import { BadRequestError } from '@/_errors/bad-request-error';
import type { IAuthenticateUseCases } from '@/protocols/authenticate/authenticate-usecases';
import type { IUserRepositoryGetUser } from '@/protocols/user/user-repository';

export class AuthenticateUseCases implements IAuthenticateUseCases {
  constructor(private readonly userRepository: IUserRepositoryGetUser) {}

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestError('Invalid e-mail or password.');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestError('Invalid e-mail or password.');
    }

    return { id: user.id };
  }

  async createAccount(name: string, email: string, password: string) {
    const findUserWithSameEmail = await this.userRepository.findByEmail(email);

    if (findUserWithSameEmail) {
      throw new BadRequestError('User with same e-mail already exists.');
    }

    const passwordHash = await hash(password, 6);

    await this.userRepository.createUser(name, email, passwordHash);
  }
}
