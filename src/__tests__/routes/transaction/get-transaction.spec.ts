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
    get: jest.fn().mockResolvedValue({
      transactions: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Sample Transaction',
          created: '2024-01-01',
          type: 'WITHDRAW',
          value: 100,
        },
      ],
    }),
  }),
}));

describe('GET /transaction', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to get all user transactions', async () => {
    const response = await supertest(app.server)
      .get('/transaction')
      .set('Authorization', `Bearer ${token}`)
      .query({ limit: 12, offset: 0 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      transactions: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Sample Transaction',
          created: '2024-01-01',
          type: 'WITHDRAW',
          value: 100,
        },
      ],
    });
    expect(makeTransactionUseCases().get).toHaveBeenCalledWith(
      expect.any(String),
      12,
      0,
    );
  });

  it('should return 404 if transactions are not found', async () => {
    (makeTransactionUseCases().get as jest.Mock).mockRejectedValueOnce(
      new Error('Transactions not found.'),
    );

    const response = await supertest(app.server)
      .get('/transaction')
      .set('Authorization', `Bearer ${token}`)
      .query({ limit: 10, offset: 0 });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Transactions not found.',
    });
  });
});
