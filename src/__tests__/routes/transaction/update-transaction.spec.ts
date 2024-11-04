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
    update: jest.fn(),
  }),
}));

describe('UPDATE /transaction', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able update transaction', async () => {
    const response = await supertest(app.server)
      .put('/transaction?transactionId=123')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'teste',
        type: 'DEPOSIT',
        value: 100,
      });

    expect(response.status).toBe(204);
  });

  it('should return 401 when try to delete transaction', async () => {
    (makeTransactionUseCases().update as jest.Mock).mockRejectedValueOnce(
      new Error('Cannot update transaction.'),
    );

    const response = await supertest(app.server)
      .put('/transaction?transactionId=123')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'teste',
        type: 'DEPOSIT',
        value: 100,
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Cannot update transaction.',
    });
  });
});
