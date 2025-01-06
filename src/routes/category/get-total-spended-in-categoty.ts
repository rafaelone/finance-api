import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeCategoryUseCases } from '@/factories/usecases/category-factory';
import { auth } from '@/middlewares/auth';

export async function getCategoriesTotalSpended(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/category/total-spended',
      {
        schema: {
          tags: ['Category'],
          summary: 'Get total spended in category',
          security: [
            {
              bearerAuth: [],
            },
          ],

          response: {
            200: z.object({
              totalMoney: z.number(),
              categories: z.array(
                z.object({
                  percentage: z.number(),
                  name: z.string(),
                  totalWithdraw: z.number(),
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

          const response = await categoryUsecase.getTotalSpended(
            userId,
            Number(limit ?? 12),
            Number(offset ?? 0),
          );

          return reply.status(201).send(response);
        } catch (err) {
          return reply.status(404).send({
            message: 'Categories not found.',
          });
        }
      },
    );
}
