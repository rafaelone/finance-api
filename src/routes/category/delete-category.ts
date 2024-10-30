import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeCategoryUseCases } from '@/factories/usecases/category-factory';
import { auth } from '@/middlewares/auth';

export async function deleteCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/category',
      {
        schema: {
          tags: ['Category'],
          summary: 'Delete a category',
          security: [
            {
              bearerAuth: [],
            },
          ],
          querystring: z.object({
            categoryId: z.string(),
          }),
        },
      },
      async (
        request: FastifyRequest<{
          Querystring: {
            categoryId: string;
          };
        }>,
        reply,
      ) => {
        try {
          const { categoryId } = request.query;

          const categoryUsecase = makeCategoryUseCases();

          await categoryUsecase.delete(categoryId);
          return reply.status(204).send();
        } catch (err) {
          return reply.status(401).send({
            message: 'Cannot delete category.',
          });
        }
      },
    );
}
