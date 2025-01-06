import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeTransactionUseCases } from '@/factories/usecases/transaction-factory';
import { auth } from '@/middlewares/auth';

export async function getRevenue(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/transaction/revenue',
      {
        schema: {
          tags: ['Transaction'],
          summary: 'Get total revenues amount',
          security: [
            {
              bearerAuth: [],
            },
          ],

          response: {
            200: z.object({
              revenue: z.number(),
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

          const transactionUsecase = makeTransactionUseCases();

          const revenue = await transactionUsecase.revenues(userId);
          return reply.status(201).send({ revenue });
        } catch (err) {
          return reply.status(404).send({
            message: 'Revenue not found.',
          });
        }
      },
    );
}
