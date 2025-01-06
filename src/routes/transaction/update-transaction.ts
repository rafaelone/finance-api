import type { TransactionType } from '@prisma/client';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeTransactionUseCases } from '@/factories/usecases/transaction-factory';
import { auth } from '@/middlewares/auth';

export async function updateTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/transaction',
      {
        schema: {
          tags: ['Transaction'],
          summary: 'Update a transaction',
          security: [
            {
              bearerAuth: [],
            },
          ],
          querystring: z.object({
            transactionId: z.string(),
          }),
          body: z.object({
            name: z.string(),
            type: z.string(),
            value: z.number(),
          }),
        },
      },
      async (
        request: FastifyRequest<{
          Body: {
            name: string;
            type: TransactionType;
            value: number;
          };
          Querystring: {
            transactionId: string;
          };
        }>,
        reply,
      ) => {
        try {
          console.log('aaa');
          const userId = await request.getCurrentUserId();
          console.log(userId);

          const { transactionId } = request.query;
          const { name, type, value } = request.body;
          console.log(request.body);

          const transactionUsecase = makeTransactionUseCases();

          await transactionUsecase.update(
            userId,
            transactionId,
            name,
            type,
            value,
          );
          return reply.status(204).send();
        } catch (err) {
          return reply.status(401).send({
            message: 'Cannot update transaction.',
          });
        }
      },
    );
}
