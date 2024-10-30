import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeCategoryUseCases } from '@/factories/usecases/category-factory';
import { auth } from '@/middlewares/auth';

export async function updateCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/category',
      {
        schema: {
          tags: ['Category'],
          summary: 'Update a category',
          security: [
            {
              bearerAuth: [],
            },
          ],
          querystring: z.object({
            categoryId: z.string(),
          }),
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
          Querystring: {
            categoryId: string;
          };
        }>,
        reply,
      ) => {
        try {
          const userId = await request.getCurrentUserId();

          const { categoryId } = request.query;
          const { name } = request.body;
          console.log(request.body);

          const transactionUsecase = makeCategoryUseCases();

          await transactionUsecase.update(categoryId, name, userId);
          return reply.status(204).send();
        } catch (err) {
          return reply.status(401).send({
            message: 'Cannot update category.',
          });
        }
      },
    );
}
