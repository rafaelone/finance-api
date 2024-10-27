// import Fastify from 'fastify';
import supertest from 'supertest';

import { app } from '@/app';
import { makeAuthenticaUseCases } from '@/factories/usecases/authenticate-factory';

jest.mock('@/factories/usecases/authenticate-factory');

describe('POST /create-account', () => {
  // let app;

  beforeAll(async () => {
    await app.ready();
    // app = Fastify();
    // createAccount(app); // Registra a rota `createAccount` no Fastify
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new account and return 201 status', async () => {
    const mockCreateAccount = jest.fn().mockResolvedValueOnce(undefined);
    (makeAuthenticaUseCases as jest.Mock).mockImplementation(() => ({
      createAccount: mockCreateAccount,
    }));

    const response = await supertest(app.server).post('/create-account').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword',
    });

    expect(response.status).toBe(201);
    expect(mockCreateAccount).toHaveBeenCalledWith(
      'John Doe',
      'john@example.com',
      'securepassword',
    );
  });

  it('should return 401 status if email is already used', async () => {
    const mockCreateAccount = jest
      .fn()
      .mockRejectedValueOnce(new Error('E-mail already used.'));
    (makeAuthenticaUseCases as jest.Mock).mockImplementation(() => ({
      createAccount: mockCreateAccount,
    }));

    const response = await supertest(app.server).post('/create-account').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'E-mail already used.' });
  });
});
