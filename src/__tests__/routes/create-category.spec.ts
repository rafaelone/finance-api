import { compare } from 'bcryptjs';
import supertest from 'supertest';

import { app } from '@/app';
import { makeAuthenticaUseCases } from '@/factories/usecases/authenticate-factory';
import { makeCategoryUseCases } from '@/factories/usecases/category-factory';
import type { IUserRepositoryGetUser } from '@/protocols/user/user-repository';
import { AuthenticateUseCases } from '@/usecases/authenticate-usecases';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('@/factories/usecases/authenticate-factory');
jest.mock('@/factories/usecases/category-factory');

describe('POST /category', () => {
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

  it('should create a new category', async () => {
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

    (makeCategoryUseCases as jest.Mock).mockImplementation(() => ({
      create: jest.fn(),
    }));

    const category = await supertest(app.server)
      .post('/category')
      .set('Authorization', `Bearer ${data.token}`)
      .send({
        name: 'New Category',
      });
    expect(category.status).toBe(201);
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

    (makeCategoryUseCases as jest.Mock).mockImplementation(() => ({
      create: jest.fn().mockRejectedValueOnce(new Error('Creation failed')),
    }));

    const category = await supertest(app.server)
      .post('/category')
      .set('Authorization', `Bearer ${data.token}`) // Simulando o token gerado no login
      .send({
        name: 'New Category',
      });
    expect(category.status).toBe(401);
    expect(category.body).toEqual({
      message: 'Unable to create category.',
    });
  });
});
