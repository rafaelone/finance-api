import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeCategoryUseCases } from '@/factories/usecases/category-factory';
import { auth } from '@/middlewares/auth';

export async function createCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/category',
      {
        schema: {
          tags: ['Category'],
          summary: 'Create new category',
          security: [
            {
              bearerAuth: [],
            },
          ],
          body: z.object({
            name: z.string(),
          }),
        },
      },
      async (
        request: FastifyRequest<{
          Body: {
            name: string;
          };
        }>,
        reply,
      ) => {
        try {
          const userId = await request.getCurrentUserId();

          const { name } = request.body;

          const CategoryUseCases = makeCategoryUseCases();

          await CategoryUseCases.create(userId, name);

          return reply.status(201).send();
        } catch (err) {
          return reply.status(401).send({
            message: 'Unable to create category.',
          });
        }
      },
    );
}
