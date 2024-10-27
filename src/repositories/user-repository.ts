import type { PrismaClient } from '@prisma/client';

import type { IUser } from '@/protocols/user/user';
import type { IUserRepository } from '@/protocols/user/user-repository';

export class UserRepository implements IUserRepository {
  private prismaUserClient;
  constructor(private readonly prismaClient: PrismaClient) {
    this.prismaUserClient = this.prismaClient.user;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await this.prismaUserClient.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        transactions: true,
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.prismaUserClient.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        transactions: true,
      },
    });
    return user;
  }

  async createUser(name: string, email: string, password: string) {
    await this.prismaUserClient.create({
      data: {
        name,
        email,
        password,
      },
    });
  }
}
