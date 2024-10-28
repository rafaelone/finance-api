import { compare, hash } from 'bcryptjs';

import { BadRequestError } from '@/_errors/bad-request-error';
import type { IUserRepositoryGetUser } from '@/protocols/user/user-repository';
import { AuthenticateUseCases } from '@/usecases/authenticate-usecases';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('Authenticate Usecases', () => {
  let authenticateUseCases: AuthenticateUseCases;
  let userRepository: jest.Mocked<IUserRepositoryGetUser>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
    } as unknown as jest.Mocked<IUserRepositoryGetUser>;

    authenticateUseCases = new AuthenticateUseCases(userRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should return user id when email and password are corrects', async () => {
      const user = {
        id: '1',
        name: 'valid',
        email: 'valid@example.com',
        password: 'hashed_password',
        transactions: [],
      };
      userRepository.findByEmail.mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await authenticateUseCases.signIn(
        'valid@example.com',
        'correct_password',
      );

      expect(result).toEqual({ id: user.id });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'valid@example.com',
      );
      expect(compare).toHaveBeenCalledWith('correct_password', user.password);
    });

    it('should return error when user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authenticateUseCases.signIn('invalid@example.com', 'password'),
      ).rejects.toThrow('Invalid e-mail or password.');
    });

    it('should return error when user password is wrong', async () => {
      userRepository.findByEmail.mockResolvedValue({
        id: '1',
        email: 'valid@example.com',
        password: 'hashed_password',
        transactions: [],
        name: 'valid',
      });
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authenticateUseCases.signIn('valid@example.com', 'wrong_password'),
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe('create account', () => {
    it('should return error when e-mail already exists', async () => {
      userRepository.findByEmail.mockResolvedValue({
        id: '1',
        name: 'joe doe',
        email: 'existing@example.com',
        password: 'hashed_password',
        transactions: [],
      });
      await expect(
        authenticateUseCases.createAccount(
          'User',
          'existing@example.com',
          'password',
        ),
      ).rejects.toThrow(BadRequestError);
    });
    it('should create a new account if e-mail not exists', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      (hash as jest.Mock).mockResolvedValue('hashed_password');

      await authenticateUseCases.createAccount(
        'User',
        'new@example.com',
        'password',
      );

      expect(userRepository.createUser).toHaveBeenCalledWith(
        'User',
        'new@example.com',
        'hashed_password',
      );
      expect(hash).toHaveBeenCalledWith('password', 6);
    });
  });
});
