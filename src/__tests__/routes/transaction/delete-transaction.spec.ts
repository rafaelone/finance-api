import supertest from 'supertest';

import { app } from '@/app';
import { makeTransactionUseCases } from '@/factories/usecases/transaction-factory';

// import { token } from '../category/create-category.spec';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDkxYzkxZi1mZTljLTQ1NmUtYmQ1Yy1hOTViMjA3M2VhNmYiLCJpYXQiOjE3MzA0ODc2OTMsImV4cCI6OC42NGUrMjh9.c1uxvJ9hhyhKNPR17x_26eVo4GcHon4au71nSjJOx6E';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('@/factories/usecases/transaction-factory', () => ({
  makeTransactionUseCases: jest.fn().mockReturnValue({
    delete: jest.fn(),
  }),
}));

describe('DELETE /transaction', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able delete transaction', async () => {
    const response = await supertest(app.server)
      .delete('/transaction?transactionId=123')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('should return 401 when try to delete transaction', async () => {
    (makeTransactionUseCases().delete as jest.Mock).mockRejectedValueOnce(
      new Error('Cannot delete transaction.'),
    );

    const response = await supertest(app.server)
      .delete('/transaction?transactionId=123')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Cannot delete transaction.',
    });
  });
});
