import type { FastifyInstance, FastifyRequest } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeAuthenticaUseCases } from '@/factories/usecases/authenticate-factory';

export function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/create-account',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
          email: string;
          password: string;
        };
      }>,
      reply,
    ) => {
      try {
        const { name, email, password } = request.body;
        const authenticateUseCases = makeAuthenticaUseCases();

        await authenticateUseCases.createAccount(name, email, password);

        return reply.status(201).send();
      } catch (err) {
        return reply.status(401).send({
          message: 'E-mail already used.',
        });
      }
    },
  );
}
