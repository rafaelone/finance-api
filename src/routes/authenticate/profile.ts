import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeAuthenticaUseCases } from '@/factories/usecases/authenticate-factory';
import { auth } from '@/middlewares/auth';

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/me',
      {
        schema: {
          tags: ['Profile'],
          summary: 'Get user info',
          security: [
            {
              bearerAuth: [],
            },
          ],
          response: {
            200: z.object({
              user: z.object({
                id: z.string().uuid(),
                name: z.string(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        try {
          const userId = await request.getCurrentUserId();

          const categoryUsecase = makeAuthenticaUseCases();

          const response = await categoryUsecase.getProfile(userId);

          return reply.status(201).send({ user: response });
        } catch (err) {
          return reply.status(404).send({
            message: 'User not found.',
          });
        }
      },
    );
}
