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

describe('GET /category', () => {
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

  it('should get all user categories', async () => {
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

    (makeCategoryUseCases as jest.Mock).mockImplementation(() => ({
      get: jest.fn().mockReturnValue([
        {
          id: '1',
          name: 'Category 1',
          createdAt: 'OCT 20, 2024',
          updatedAt: 'OCT 20, 2024',
          userId: '123',
          transactions: [
            {
              id: '1',
              userId: '123',
              name: 'Transaction 1',
              type: 'DEPOSIT',
              value: 100,
              createdAt: 'OCT 20, 2024',
              updatedAt: 'OCT 20, 2024',
            },
            {
              id: '1',
              userId: '123',
              name: 'Transaction 2',
              type: 'WITHDRAW',
              value: 50,
              createdAt: 'OCT 20, 2024',
              updatedAt: 'OCT 20, 2024',
            },
          ],
        },
      ]),
    }));

    const category = await supertest(app.server)
      .get('/category')
      .set('Authorization', `Bearer ${data.token}`);

    expect(category.status).toBe(201);
    expect(category.body).toEqual([{ id: '1', name: 'Category 1', value: 50 }]);
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

    (makeCategoryUseCases as jest.Mock).mockImplementation(() => ({
      get: jest.fn().mockRejectedValueOnce(new Error('Categories not found')),
    }));

    const category = await supertest(app.server)
      .get('/category')
      .set('Authorization', `Bearer ${data.token}`);

    expect(category.status).toBe(404);
    expect(category.body).toEqual({
      message: 'Categories not found.',
    });
  });
});
