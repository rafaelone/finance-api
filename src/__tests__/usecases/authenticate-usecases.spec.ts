import { hash } from 'bcryptjs';

import { BadRequestError } from '@/_errors/bad-request-error';
import { AuthenticateUseCases } from '@/usecases/authenticate-usecases';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('Authenticate Usecases', () => {
  const mockUserRepository = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  let authenticateUseCases: AuthenticateUseCases;

  beforeEach(() => {
    authenticateUseCases = new AuthenticateUseCases(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create account', () => {
    it('should create new user if email is unique', async () => {
      mockUserRepository.findByEmail.mockReturnValueOnce(null);
      (hash as jest.Mock).mockResolvedValueOnce('hashedPassword');

      await authenticateUseCases.createAccount(
        'John Doe',
        'test@example.com',
        'password',
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(hash).toHaveBeenCalledWith('password', 6);
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(
        'John Doe',
        'test@example.com',
        'hashedPassword',
      );
    });
    it('should throw BadRequestError if user with same email exists', async () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'test@example.com' };
      mockUserRepository.findByEmail.mockResolvedValueOnce(mockUser);

      await expect(
        authenticateUseCases.createAccount(
          'John Doe',
          'test@example.com',
          'password',
        ),
      ).rejects.toThrow(BadRequestError);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });
  });
});
