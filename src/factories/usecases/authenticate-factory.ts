import { AuthenticateUseCases } from '@/usecases/authenticate-usecases';

import { makeUserRepository } from '../user-repository-factory';

export function makeAuthenticaUseCases() {
  return new AuthenticateUseCases(makeUserRepository());
}
