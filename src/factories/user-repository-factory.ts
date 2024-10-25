import { UserRepository } from '@/repositories/user-repository';

import { makePrismaClient } from './prisma-client-factory';

export function makeUserRepository() {
  return new UserRepository(makePrismaClient());
}
