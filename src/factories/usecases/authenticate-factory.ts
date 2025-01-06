import { AuthenticateUseCases } from '@/usecases/authenticate-usecases';

import { makeUserRepository } from '../repository/user-repository-factory';

export function makeAuthenticaUseCases() {
  return new AuthenticateUseCases(makeUserRepository());
}
