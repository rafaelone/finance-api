import supertest from 'supertest';

import { app } from '@/app';
import { makeTransactionUseCases } from '@/factories/usecases/transaction-factory';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDkxYzkxZi1mZTljLTQ1NmUtYmQ1Yy1hOTViMjA3M2VhNmYiLCJpYXQiOjE3MzA0ODc2OTMsImV4cCI6OC42NGUrMjh9.c1uxvJ9hhyhKNPR17x_26eVo4GcHon4au71nSjJOx6E';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('@/factories/usecases/transaction-factory', () => ({
  makeTransactionUseCases: jest.fn().mockReturnValue({
    revenues: jest.fn().mockResolvedValue(300),
  }),
}));

describe('GET /transaction/revenue', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to get user revenue', async () => {
    const response = await supertest(app.server)
      .get('/transaction/revenue')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      revenue: 300,
    });
    expect(makeTransactionUseCases().revenues).toHaveBeenCalledWith(
      expect.any(String),
    );
  });

  it('should return 404 if not found user revenues', async () => {
    (makeTransactionUseCases().revenues as jest.Mock).mockRejectedValueOnce(
      new Error('Revenue not found.'),
    );

    const response = await supertest(app.server)
      .get('/transaction/revenue')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Revenue not found.',
    });
  });
});
