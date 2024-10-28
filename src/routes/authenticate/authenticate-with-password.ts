import type { FastifyInstance, FastifyRequest } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeAuthenticaUseCases } from '@/factories/usecases/authenticate-factory';

export function authenticateWithPassword(app: FastifyInstance) {
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
    async (
      request: FastifyRequest<{ Body: { email: string; password: string } }>,
      reply,
    ) => {
      try {
        const { email, password } = request.body;
        // const prisma = makePrismaService();
        // const userService = new UserService(prisma);

        const authenticate = makeAuthenticaUseCases();

        const response = await authenticate.signIn(email, password);

        // return response;

        const token = await reply.jwtSign(
          {
            sub: response.id,
          },
          {
            sign: {
              expiresIn: '1d',
            },
          },
        );

        return reply.status(201).send({ token });
      } catch (err) {
        return reply.status(401).send({
          message: 'Try later',
        });
      }
    },
  );
}
