// import { Prisma, PrismaClient } from '@prisma/client';

import type { PrismaClient } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';

import type { AppErrorService } from '@/protocols/app-error-services';
import type { IUSerService } from '@/protocols/services/user-service';

export class UserService implements IUSerService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly prismaClient: PrismaClient<
      {
        log: 'query'[];
      },
      never,
      DefaultArgs
    >,
  ) {}

  // signIn: (
  //   email: string,
  //   password: string,
  // ) => Promise<{ token: string; status: number } | AppErrorService> {
  //   return {

  //   }
  // }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ token: string; status: number } | AppErrorService> {
    console.log(email, password);

    // await prismaClient.

    const users = await this.prismaClient.user.findUnique({
      where: { email },
    });

    console.log(users);

    return {
      token: '',
      status: 201,
    };
  }
}
