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
    create: jest.fn(),
  }),
}));

describe('POST /transaction', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able create new user transaction', async () => {
    const response = await supertest(app.server)
      .post('/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: '123',
        name: 'teste',
        type: 'DEPOSIT',
        value: 100,
        categoryId: '8d7f4153-188b-42e7-8c62-55b8f623cfd7',
        date: 'OCT 20, 2024',
      });

    expect(response.status).toBe(201);
  });

  it('should return 401 when try to create new transaction', async () => {
    (makeTransactionUseCases().create as jest.Mock).mockRejectedValueOnce(
      new Error('Unable to create transaction.'),
    );

    const response = await supertest(app.server)
      .post('/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: '123',
        name: 'teste',
        type: 'DEPOSIT',
        value: 100,
        categoryId: '8d7f4153-188b-42e7-8c62-55b8f623cfd7',
        date: 'OCT 20, 2024',
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Unable to create transaction.',
    });
  });
});
