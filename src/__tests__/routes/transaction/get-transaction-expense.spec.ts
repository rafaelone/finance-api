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
    expenses: jest.fn().mockResolvedValue(300),
  }),
}));

describe('GET /transaction/expense', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to get user expense', async () => {
    const response = await supertest(app.server)
      .get('/transaction/expense')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      expense: 300,
    });
    expect(makeTransactionUseCases().expenses).toHaveBeenCalledWith(
      expect.any(String),
    );
  });

  it('should return 404 if not found user expense', async () => {
    (makeTransactionUseCases().expenses as jest.Mock).mockRejectedValueOnce(
      new Error('Expense not found.'),
    );

    const response = await supertest(app.server)
      .get('/transaction/expense')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Expense not found.',
    });
  });
});
