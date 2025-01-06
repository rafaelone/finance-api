import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeTransactionUseCases } from '@/factories/usecases/transaction-factory';
import { auth } from '@/middlewares/auth';

export async function deleteTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/transaction',
      {
        schema: {
          tags: ['Transaction'],
          summary: 'Delete a transaction',
          security: [
            {
              bearerAuth: [],
            },
          ],
          querystring: z.object({
            transactionId: z.string(),
          }),
        },
      },
      async (
        request: FastifyRequest<{
          Querystring: {
            transactionId: string;
          };
        }>,
        reply,
      ) => {
        try {
          const { transactionId } = request.query;

          const transactionUsecase = makeTransactionUseCases();

          await transactionUsecase.delete(transactionId);
          return reply.status(204).send();
        } catch (err) {
          return reply.status(401).send({
            message: 'Cannot delete transaction.',
          });
        }
      },
    );
}
