import { compare } from 'bcryptjs';
import supertest from 'supertest';

import { app } from '@/app';
import { makeAuthenticaUseCases } from '@/factories/usecases/authenticate-factory';
import { makeTransactionUseCases } from '@/factories/usecases/transaction-factory';
import type { IUserRepositoryGetUser } from '@/protocols/user/user-repository';
import { AuthenticateUseCases } from '@/usecases/authenticate-usecases';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('@/factories/usecases/authenticate-factory');
jest.mock('@/factories/usecases/transaction-factory');

describe('GET /transaction', () => {
  const user = {
    id: '123',
    name: 'Joh Doe',
    email: 'johdoe@example.com',
    password: 'johdoe123',
    transactions: [],
  };
  let authenticateUseCases: AuthenticateUseCases;
  let userRepository: jest.Mocked<IUserRepositoryGetUser>;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<IUserRepositoryGetUser>;

    authenticateUseCases = new AuthenticateUseCases(userRepository);
  });

  it('should get all user transactions', async () => {
    userRepository.findByEmail.mockResolvedValue(user);
    (compare as jest.Mock).mockResolvedValue(true);

    await authenticateUseCases.signIn('johdoe@example.com', 'johdoe123');

    const mockSignIn = jest.fn().mockResolvedValueOnce({ id: '123' });

    (makeAuthenticaUseCases as jest.Mock).mockImplementation(() => ({
      signIn: mockSignIn,
    }));

    const response = await supertest(app.server).post('/authenticate').send({
      email: 'johdoe@example.com',
      password: 'johdoe123',
    });

    const data: { token: string } = JSON.parse(response.text);

    (makeTransactionUseCases as jest.Mock).mockImplementation(() => ({
      get: jest.fn().mockReturnValue([
        {
          id: '123',
          name: 'transaction 1',
          created: 'OCT 20, 2024',
          type: 'DEPOSIT',
          value: 100,
        },
      ]),
    }));

    const transaction = await supertest(app.server)
      .get('/transaction')
      .set('Authorization', `Bearer ${data.token}`);

    expect(transaction.status).toBe(201);
    expect(transaction.body).toEqual([
      {
        id: '123',
        name: 'transaction 1',
        created: 'OCT 20, 2024',
        type: 'DEPOSIT',
        value: 100,
      },
    ]);
  });

  it('should return 404 if error', async () => {
    userRepository.findByEmail.mockResolvedValue(user);
    (compare as jest.Mock).mockResolvedValue(true);

    await authenticateUseCases.signIn('johdoe@example.com', 'johdoe123');

    const mockSignIn = jest.fn().mockResolvedValueOnce({ id: '123' });

    (makeAuthenticaUseCases as jest.Mock).mockImplementation(() => ({
      signIn: mockSignIn,
    }));

    const response = await supertest(app.server).post('/authenticate').send({
      email: 'johdoe@example.com',
      password: 'johdoe123',
    });

    const data: { token: string } = JSON.parse(response.text);

    (makeTransactionUseCases as jest.Mock).mockImplementation(() => ({
      get: jest.fn().mockRejectedValueOnce(new Error('transactions not found')),
    }));

    const transaction = await supertest(app.server)
      .get('/transaction')
      .set('Authorization', `Bearer ${data.token}`);

    expect(transaction.status).toBe(404);
    expect(transaction.body).toEqual({
      message: 'Transactions not found.',
    });
  });
});
