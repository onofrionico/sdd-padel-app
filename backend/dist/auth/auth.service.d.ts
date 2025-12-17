import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
type UserWithoutPassword = Omit<User, 'password'>;
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<UserWithoutPassword | null>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: UserWithoutPassword;
    }>;
    register(registerDto: RegisterDto): Promise<UserWithoutPassword>;
}
export {};
