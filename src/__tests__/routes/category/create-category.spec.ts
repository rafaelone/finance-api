import supertest from 'supertest';

import { app } from '@/app';
import { makeCategoryUseCases } from '@/factories/usecases/category-factory';
jest.mock('@/factories/usecases/category-factory');

export const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDkxYzkxZi1mZTljLTQ1NmUtYmQ1Yy1hOTViMjA3M2VhNmYiLCJpYXQiOjE3MzA0ODc2OTMsImV4cCI6OC42NGUrMjh9.c1uxvJ9hhyhKNPR17x_26eVo4GcHon4au71nSjJOx6E';

describe('POST /category', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new category', async () => {
    (makeCategoryUseCases as jest.Mock).mockImplementation(() => ({
      create: jest.fn(),
    }));

    const category = await supertest(app.server)
      .post('/category')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Category',
      });
    expect(category.status).toBe(201);
  });

  it('should return 401 if creation failed', async () => {
    (makeCategoryUseCases as jest.Mock).mockImplementation(() => ({
      create: jest
        .fn()
        .mockRejectedValue(new Error('Unable do create category')),
    }));

    const category = await supertest(app.server)
      .post('/category')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Category',
      });
    expect(category.status).toBe(401);
  });
});
