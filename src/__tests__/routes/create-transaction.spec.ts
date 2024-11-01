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

describe('POST /transaction', () => {
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

  it('should create a new transaction', async () => {
    userRepository.findByEmail.mockResolvedValue(user);
    (compare as jest.Mock).mockResolvedValue(true);

    const result = await authenticateUseCases.signIn(
      'johdoe@example.com',
      'johdoe123',
    );

    expect(result).toEqual({ id: user.id });
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      'johdoe@example.com',
    );
    expect(compare).toHaveBeenCalledWith('johdoe123', user.password);
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
      create: jest.fn(),
    }));

    const transaction = await supertest(app.server)
      .post('/transaction')
      .set('Authorization', `Bearer ${data.token}`)
      .send({
        name: 'New Transaction',
        type: 'DEPOSIT',
        value: 100,
        categoryId: '746e1e11-5c78-44a4-825b-300d8ddb0bd9',
        date: 'OCT 20, 2024',
      });

    expect(transaction.status).toBe(201);
  });

  it('should return 401 if creation fails', async () => {
    userRepository.findByEmail.mockResolvedValue(user);
    (compare as jest.Mock).mockResolvedValue(true);

    const result = await authenticateUseCases.signIn(
      'johdoe@example.com',
      'johdoe123',
    );

    expect(result).toEqual({ id: user.id });
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      'johdoe@example.com',
    );
    expect(compare).toHaveBeenCalledWith('johdoe123', user.password);
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
      create: jest.fn().mockRejectedValueOnce(new Error('Creation failed')),
    }));

    const transaction = await supertest(app.server)
      .post('/transaction')
      .set('Authorization', `Bearer ${data.token}`) // Simulando o token gerado no login
      .send({
        name: 'New Transaction',
        type: 'DEPOSIT',
        value: 100,
        categoryId: '746e1e11-5c78-44a4-825b-300d8ddb0bd9',
        date: 'OCT 20, 2024',
      });
    expect(transaction.status).toBe(401);
    expect(transaction.body).toEqual({
      message: 'Unable to create transaction.',
    });
  });
});
