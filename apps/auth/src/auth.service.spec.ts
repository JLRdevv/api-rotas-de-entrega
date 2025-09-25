import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { AuthService } from './auth.service';
import { UsersService } from './users/users.service';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: {
        signup: jest.Mock;
        login: jest.Mock;
        whoami: jest.Mock;
    };
    let jwtService: {
        sign: jest.Mock;
    };

    const mockUserId = new ObjectId();
    const mockToken = 'mock.jwt.token';
    const mockUserData = {
        _id: mockUserId,
        email: 'test@example.com',
    };

    beforeEach(async () => {
        const mockUsersService = {
            signup: jest.fn(),
            login: jest.fn(),
            whoami: jest.fn(),
        };

        const mockJwtService = {
            sign: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get(UsersService);
        jwtService = module.get(JwtService);

        jest.clearAllMocks();
    });

    describe('signup', () => {
        it('should create a new user and return JWT token', async () => {
            usersService.signup.mockResolvedValue(mockUserId);
            jwtService.sign.mockReturnValue(mockToken);

            const result = await service.signup(
                'test@example.com',
                'password123',
            );

            expect(usersService.signup).toHaveBeenCalledWith(
                'test@example.com',
                'password123',
            );
            expect(jwtService.sign).toHaveBeenCalledWith({
                _id: mockUserId.toString(),
            });
            expect(result).toBe(mockToken);
        });

        it('should throw RpcException when user signup fails', async () => {
            const signupError = new RpcException({
                statusCode: 409,
                message: 'Email already in use',
            });
            usersService.signup.mockRejectedValue(signupError);

            await expect(
                service.signup('test@example.com', 'password123'),
            ).rejects.toThrow(signupError);

            expect(usersService.signup).toHaveBeenCalledWith(
                'test@example.com',
                'password123',
            );
            expect(jwtService.sign).not.toHaveBeenCalled();
        });

        it('should throw error when JWT signing fails', async () => {
            usersService.signup.mockResolvedValue(mockUserId);
            const jwtError = new Error('JWT signing failed');
            jwtService.sign.mockImplementation(() => {
                throw jwtError;
            });

            await expect(
                service.signup('test@example.com', 'password123'),
            ).rejects.toThrow(jwtError);

            expect(usersService.signup).toHaveBeenCalledWith(
                'test@example.com',
                'password123',
            );
            expect(jwtService.sign).toHaveBeenCalledWith({
                _id: mockUserId.toString(),
            });
        });
    });

    describe('login', () => {
        it('should authenticate user and return JWT token', async () => {
            usersService.login.mockResolvedValue(mockUserId);
            jwtService.sign.mockReturnValue(mockToken);

            const result = await service.login(
                'test@example.com',
                'password123',
            );

            expect(usersService.login).toHaveBeenCalledWith(
                'test@example.com',
                'password123',
            );
            expect(jwtService.sign).toHaveBeenCalledWith({
                _id: mockUserId.toString(),
            });
            expect(result).toBe(mockToken);
        });

        it('should throw RpcException when login fails', async () => {
            const loginError = new RpcException({
                statusCode: 401,
                message: 'Wrong email or password',
            });
            usersService.login.mockRejectedValue(loginError);

            await expect(
                service.login('test@example.com', 'wrongpassword'),
            ).rejects.toThrow(loginError);

            expect(usersService.login).toHaveBeenCalledWith(
                'test@example.com',
                'wrongpassword',
            );
            expect(jwtService.sign).not.toHaveBeenCalled();
        });

        it('should throw error when JWT signing fails', async () => {
            usersService.login.mockResolvedValue(mockUserId);
            const jwtError = new Error('JWT signing failed');
            jwtService.sign.mockImplementation(() => {
                throw jwtError;
            });

            await expect(
                service.login('test@example.com', 'password123'),
            ).rejects.toThrow(jwtError);

            expect(usersService.login).toHaveBeenCalledWith(
                'test@example.com',
                'password123',
            );
            expect(jwtService.sign).toHaveBeenCalledWith({
                _id: mockUserId.toString(),
            });
        });
    });

    describe('whoami', () => {
        it('should return user data when user exists', async () => {
            const userId = mockUserId.toString();
            usersService.whoami.mockResolvedValue(mockUserData);

            const result = await service.whoami(userId);

            expect(usersService.whoami).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockUserData);
        });

        it('should throw RpcException when user does not exist', async () => {
            const userId = mockUserId.toString();
            const whoamiError = new RpcException({
                statusCode: 401,
                message: 'User does not exist',
            });
            usersService.whoami.mockRejectedValue(whoamiError);

            await expect(service.whoami(userId)).rejects.toThrow(whoamiError);

            expect(usersService.whoami).toHaveBeenCalledWith(userId);
        });

        it('should throw RpcException when database operation fails', async () => {
            const userId = mockUserId.toString();
            const databaseError = new RpcException({
                statusCode: 500,
                message: 'Failed to reach database',
            });
            usersService.whoami.mockRejectedValue(databaseError);

            await expect(service.whoami(userId)).rejects.toThrow(databaseError);

            expect(usersService.whoami).toHaveBeenCalledWith(userId);
        });
    });
});
