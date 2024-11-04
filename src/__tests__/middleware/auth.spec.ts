import request from 'supertest';

import { app } from '@/app';
export const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDkxYzkxZi1mZTljLTQ1NmUtYmQ1Yy1hOTViMjA3M2VhNmYiLCJpYXQiOjE3MzA0ODc2OTMsImV4cCI6OC42NGUrMjh9.c1uxvJ9hhyhKNPR17x_26eVo4GcHon4au71nSjJOx6E';

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

describe('Auth Middleware', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow access with a valid token', async () => {
    const response = await request(app.server)
      .get('/transaction')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
  });

  it('should return 401 for an invalid token', async () => {
    const response = await request(app.server)
      .get('/transaction')
      .set('Authorization', 'Bearer invalid-jwt-token');
    console.log(response);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Transactions not found.',
    });
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app.server).get('/transaction');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Transactions not found.',
    });
  });
});
