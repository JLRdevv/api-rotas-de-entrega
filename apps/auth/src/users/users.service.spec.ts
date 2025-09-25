import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import * as passwordUtils from './helpers/password.utils';

jest.mock('./helpers/password.utils');

describe('UsersService', () => {
    let service: UsersService;
    let repository: {
        findByEmail: jest.Mock;
        create: jest.Mock;
        findById: jest.Mock;
    };

    const mockUser = {
        _id: new ObjectId(),
        email: 'test@example.com',
        password: 'hashedPassword',
    };

    beforeEach(async () => {
        const mockRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: UsersRepository,
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repository = module.get(UsersRepository);

        jest.clearAllMocks();
    });

    describe('signup', () => {
        it('should create a new user successfully', async () => {
            repository.findByEmail.mockResolvedValue(null);
            repository.create.mockResolvedValue(mockUser);
            (passwordUtils.hashPassword as jest.Mock).mockResolvedValue(
                'hashedPassword',
            );

            const result = await service.signup(
                'test@example.com',
                'password123',
            );

            expect(repository.findByEmail).toHaveBeenCalledWith(
                'test@example.com',
            );
            expect(passwordUtils.hashPassword).toHaveBeenCalledWith(
                'password123',
            );
            expect(repository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'test@example.com',
                    password: 'hashedPassword',
                }),
            );
            expect(result).toBe(mockUser._id);
        });

        it('should throw RpcException when email is already in use', async () => {
            repository.findByEmail.mockResolvedValue(mockUser);

            await expect(
                service.signup('test@example.com', 'password123'),
            ).rejects.toThrow(
                new RpcException({
                    statusCode: 409,
                    message: 'Email already in use',
                }),
            );

            expect(repository.findByEmail).toHaveBeenCalledWith(
                'test@example.com',
            );
            expect(repository.create).not.toHaveBeenCalled();
        });

        it('should throw RpcException when database operation fails', async () => {
            repository.findByEmail.mockRejectedValue(
                new Error('Database error'),
            );

            await expect(
                service.signup('test@example.com', 'password123'),
            ).rejects.toThrow(
                new RpcException({
                    statusCode: 500,
                    message: 'Failed to reach database',
                }),
            );
        });

        it('should re-throw RpcException when it occurs during execution', async () => {
            const customRpcException = new RpcException({
                statusCode: 400,
                message: 'Custom error',
            });
            repository.findByEmail.mockRejectedValue(customRpcException);

            await expect(
                service.signup('test@example.com', 'password123'),
            ).rejects.toThrow(customRpcException);
        });
    });

    describe('login', () => {
        it('should return user ID when credentials are valid', async () => {
            repository.findByEmail.mockResolvedValue(mockUser);
            (passwordUtils.verifyPassword as jest.Mock).mockResolvedValue(true);

            const result = await service.login(
                'test@example.com',
                'password123',
            );

            expect(repository.findByEmail).toHaveBeenCalledWith(
                'test@example.com',
            );
            expect(passwordUtils.verifyPassword).toHaveBeenCalledWith(
                'password123',
                'hashedPassword',
            );
            expect(result).toBe(mockUser._id);
        });

        it('should throw RpcException when user does not exist', async () => {
            repository.findByEmail.mockResolvedValue(null);

            await expect(
                service.login('test@example.com', 'password123'),
            ).rejects.toThrow(
                new RpcException({
                    statusCode: 401,
                    message: 'Wrong email or password',
                }),
            );

            expect(repository.findByEmail).toHaveBeenCalledWith(
                'test@example.com',
            );
            expect(passwordUtils.verifyPassword).not.toHaveBeenCalled();
        });

        it('should throw RpcException when password is incorrect', async () => {
            repository.findByEmail.mockResolvedValue(mockUser);
            (passwordUtils.verifyPassword as jest.Mock).mockResolvedValue(
                false,
            );

            await expect(
                service.login('test@example.com', 'wrongpassword'),
            ).rejects.toThrow(
                new RpcException({
                    statusCode: 401,
                    message: 'Wrong email or password',
                }),
            );

            expect(passwordUtils.verifyPassword).toHaveBeenCalledWith(
                'wrongpassword',
                'hashedPassword',
            );
        });

        it('should throw RpcException when database operation fails', async () => {
            repository.findByEmail.mockRejectedValue(
                new Error('Database error'),
            );

            await expect(
                service.login('test@example.com', 'password123'),
            ).rejects.toThrow(
                new RpcException({
                    statusCode: 500,
                    message: 'Failed to reach database',
                }),
            );
        });

        it('should re-throw RpcException when it occurs during execution', async () => {
            const customRpcException = new RpcException({
                statusCode: 400,
                message: 'Custom error',
            });
            repository.findByEmail.mockRejectedValue(customRpcException);

            await expect(
                service.login('test@example.com', 'password123'),
            ).rejects.toThrow(customRpcException);
        });
    });

    describe('whoami', () => {
        it('should return user data when user exists', async () => {
            const userId = mockUser._id.toString();
            repository.findById.mockResolvedValue(mockUser);

            const result = await service.whoami(userId);

            expect(repository.findById).toHaveBeenCalledWith(
                new ObjectId(userId),
            );
            expect(result).toEqual({
                _id: mockUser._id,
                email: mockUser.email,
            });
        });

        it('should throw RpcException when user does not exist', async () => {
            const userId = new ObjectId().toString();
            repository.findById.mockResolvedValue(null);

            await expect(service.whoami(userId)).rejects.toThrow(
                new RpcException({
                    statusCode: 401,
                    message: 'User does not exist',
                }),
            );

            expect(repository.findById).toHaveBeenCalledWith(
                new ObjectId(userId),
            );
        });

        it('should throw RpcException when database operation fails', async () => {
            const userId = new ObjectId().toString();
            repository.findById.mockRejectedValue(new Error('Database error'));

            await expect(service.whoami(userId)).rejects.toThrow(
                new RpcException({
                    statusCode: 500,
                    message: 'Failed to reach database',
                }),
            );
        });

        it('should re-throw RpcException when it occurs during execution', async () => {
            const userId = new ObjectId().toString();
            const customRpcException = new RpcException({
                statusCode: 400,
                message: 'Custom error',
            });
            repository.findById.mockRejectedValue(customRpcException);

            await expect(service.whoami(userId)).rejects.toThrow(
                customRpcException,
            );
        });
    });
});
