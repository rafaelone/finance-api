import supertest from 'supertest';

import { app } from '@/app';
import { makeAuthenticaUseCases } from '@/factories/usecases/authenticate-factory';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('@/factories/usecases/authenticate-factory');

describe('POST /authenticate', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to sign in with email and password', async () => {
    const mockSignIn = jest.fn().mockResolvedValueOnce({ token: '123' });

    // mockSignIn.mockResolvedValue({ id: '1' });
    (makeAuthenticaUseCases as jest.Mock).mockImplementation(() => ({
      signIn: mockSignIn,
    }));
    const response = await supertest(app.server).post('/authenticate').send({
      email: 'valid@example.com',
      password: 'correct_password',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(mockSignIn).toHaveBeenCalledWith(
      'valid@example.com',
      'correct_password',
    );
  });
  it('should not be able to sign in with email and password with wrong credentials', async () => {
    const mockSignIn = jest.fn().mockResolvedValueOnce(undefined);

    // mockSignIn.mockResolvedValue({ id: '1' });
    (makeAuthenticaUseCases as jest.Mock).mockImplementation(() => ({
      signIn: mockSignIn,
    }));
    const response = await supertest(app.server).post('/authenticate').send({
      email: 'valid@example.com',
      password: 'correct_password',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Try later' });
  });
});
