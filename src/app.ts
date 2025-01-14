import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { env } from '@/env';

import { errorHandler } from './_errors/error-handler';
import { authenticateWithPassword } from './routes/authenticate/authenticate-with-password';
import { createAccount } from './routes/authenticate/create-account';
import { getProfile } from './routes/authenticate/profile';
import { createCategory } from './routes/category/create-category';
import { deleteCategory } from './routes/category/delete-category';
import { getCategories } from './routes/category/get-categories';
import { getCategoriesTotalSpended } from './routes/category/get-total-spended-in-categoty';
import { updateCategory } from './routes/category/update-category';
import { createTransaction } from './routes/transaction/create-transaction';
import { deleteTransaction } from './routes/transaction/delete-transaction';
import { getTransactionBalance } from './routes/transaction/get-transaction-balance';
import { getExpense } from './routes/transaction/get-transaction-expense';
import { getRevenue } from './routes/transaction/get-transaction-revenue';
import { getTransaction } from './routes/transaction/get-transactions';
import { updateTransaction } from './routes/transaction/update-transaction';
// import { createAccount } from './routes/authenticate/create-account';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Finances API',
      description: 'Finances API.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(fastifyCors);
app.register(createAccount);
app.register(authenticateWithPassword);
app.register(createTransaction);
app.register(createCategory);
app.register(getTransaction);
app.register(getCategories);
app.register(getCategoriesTotalSpended);
app.register(getExpense);
app.register(getRevenue);
app.register(getTransactionBalance);
app.register(updateTransaction);
app.register(deleteTransaction);

app.register(updateCategory);
app.register(deleteCategory);
app.register(getProfile);

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP server running');
});
