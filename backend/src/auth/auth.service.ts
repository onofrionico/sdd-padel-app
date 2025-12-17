import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException,
  Inject,
  forwardRef 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { User } from '../users/entities/user.entity';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await compare(password, user.password))) {
      const { password, ...result } = user;
      return result as UserWithoutPassword;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto): Promise<UserWithoutPassword> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await hash(registerDto.password, 10);
    
    // Extraer dateOfBirth del DTO y convertirlo a Date si está presente
    const { dateOfBirth, ...userData } = registerDto;
    
    // Crear el objeto de datos del usuario con la contraseña hasheada
    const userToCreate = {
      ...userData,
      password: hashedPassword,
      // Convertir dateOfBirth a Date si está presente, de lo contrario undefined
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
    };

    const newUser = await this.usersService.create(userToCreate);

    // Return user data without the password
    const { password, ...result } = newUser;
    return result as UserWithoutPassword;
  }
}
