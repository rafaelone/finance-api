import { PrismaClient } from '@prisma/client';

import { UserRepository } from '@/repositories/user-repository';

const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

describe('User Repository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository(
      mockPrismaClient as unknown as PrismaClient,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find an user by ID', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      transactions: [],
    };

    mockPrismaClient.user.findUnique.mockResolvedValueOnce(mockUser);

    const user = await userRepository.findById('1');

    expect(user).toEqual(mockUser);
  });

  it('should find an user by email', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      transactions: [],
    };

    mockPrismaClient.user.findUnique.mockResolvedValueOnce(mockUser);

    const user = await userRepository.findByEmail('john@example.com');

    expect(user).toEqual(mockUser);
  });

  it('should create a new user', async () => {
    mockPrismaClient.user.create.mockResolvedValueOnce(undefined);

    await userRepository.createUser(
      'John Doe',
      'john@example.com',
      'securepassword',
    );

    expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securepassword',
      },
    });
  });
});
