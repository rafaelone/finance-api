import type { PrismaClient } from '@prisma/client';

export class UserRepository {
  // eslint-disable-next-line no-useless-constructor
  private prismaUserClient;
  constructor(private readonly prismaClient: PrismaClient) {
    this.prismaUserClient = this.prismaClient.user;
  }

  async findById(id: string): Promise<{ name: string }> {
    this.prismaUserClient.findUnique({ where: { id } });

    return { name: '' };
  }
}
