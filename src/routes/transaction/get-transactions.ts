import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeTransactionUseCases } from '@/factories/usecases/transaction-factory';
import { auth } from '@/middlewares/auth';

export async function getTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/transaction',
      {
        schema: {
          tags: ['Transaction'],
          summary: 'Get all transaction',
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
              transactions: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  created: z.string(),
                  type: z.string(),
                  value: z.number(),
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

          const transactionUsecase = makeTransactionUseCases();

          const transactions = await transactionUsecase.get(
            userId,
            Number(limit ?? 12),
            Number(offset ?? 0),
          );
          return reply.status(201).send(transactions);
        } catch (err) {
          return reply.status(401).send({
            message: 'Transactions not found.',
          });
        }
      },
    );
}
