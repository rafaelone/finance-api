import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeAuthenticaUseCases } from '@/factories/usecases/authenticate-factory';

export function signIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/authenticate',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate',
        body: z.object({
          email: z.string(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async () => {
      // const prisma = makePrismaService();
      // const userService = new UserService(prisma);

      const user = makeAuthenticaUseCases();

      user.signIn('dadsa');
      // return response;
    },
  );
}
