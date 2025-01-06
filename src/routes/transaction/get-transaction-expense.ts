import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeTransactionUseCases } from '@/factories/usecases/transaction-factory';
import { auth } from '@/middlewares/auth';

export async function getExpense(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/transaction/expense',
      {
        schema: {
          tags: ['Transaction'],
          summary: 'Get total expenses amount',
          security: [
            {
              bearerAuth: [],
            },
          ],

          response: {
            200: z.object({
              expense: z.number(),
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

          const expense = await transactionUsecase.expenses(userId);
          return reply.status(201).send({ expense });
        } catch (err) {
          return reply.status(404).send({
            message: 'Expense not found.',
          });
        }
      },
    );
}
