import { TransactionType } from '@prisma/client';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeTransactionUseCases } from '@/factories/usecases/transaction-factory';
import { auth } from '@/middlewares/auth';

export async function createTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/transaction',
      {
        schema: {
          tags: ['Transaction'],
          summary: 'Create new transaction',
          security: [
            {
              bearerAuth: [],
            },
          ],
          body: z.object({
            name: z.string(),
            type: z.string(),
            value: z.number(),
            categoryId: z.string().uuid(),
            date: z.string(),
          }),
        },
      },
      async (
        request: FastifyRequest<{
          Body: {
            name: string;
            type: TransactionType;
            value: number;
            categoryId: string;
            date: string;
          };
        }>,
        reply,
      ) => {
        try {
          const userId = await request.getCurrentUserId();

          const { name, type, value, categoryId, date } = request.body;

          const transactionUsecase = makeTransactionUseCases();

          await transactionUsecase.create(
            userId,
            name,
            type,
            value,
            categoryId,
            date,
          );
          return reply.status(201).send();
        } catch (err) {
          return reply.status(401).send({
            message: 'Unable to create transaction.',
          });
        }
      },
    );
}
