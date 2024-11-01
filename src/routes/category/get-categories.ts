import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeCategoryUseCases } from '@/factories/usecases/category-factory';
import { auth } from '@/middlewares/auth';

export async function getCategories(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/category',
      {
        schema: {
          tags: ['Category'],
          summary: 'Get all categories',
          security: [
            {
              bearerAuth: [],
            },
          ],
          querystring: z.object({
            limit: z.string().optional(),
            offset: z.string().optional(),
          }),
          response: {
            200: z.object({
              categories: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  total: z.number().optional(),
                }),
              ),
            }),
          },
        },
      },
      async (
        request: FastifyRequest<{
          Querystring: {
            limit?: number;
            offset?: number;
          };
        }>,
        reply,
      ) => {
        try {
          const userId = await request.getCurrentUserId();

          const { limit, offset } = request.query;

          const categoryUsecase = makeCategoryUseCases();

          const response = await categoryUsecase.get(
            userId,
            Number(limit ?? 12),
            Number(offset ?? 0),
          );

          const categories = response.map((category) => ({
            id: category.id,
            name: category.name,
            value: category.transactions?.reduce((acc, total) => {
              if (total.type === 'DEPOSIT') {
                return acc + total.value;
              } else {
                return acc - total.value;
              }
            }, 0),
          }));

          return reply.status(201).send(categories);
        } catch (err) {
          return reply.status(404).send({
            message: 'Categories not found.',
          });
        }
      },
    );
}
