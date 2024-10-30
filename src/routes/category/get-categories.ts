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

          const categories = await categoryUsecase.get(
            userId,
            Number(limit ?? 12),
            Number(offset ?? 0),
          );

          console.log(categories);
          return reply.status(201).send(categories);
        } catch (err) {
          return reply.status(401).send({
            message: 'Categories not found.',
          });
        }
      },
    );
}