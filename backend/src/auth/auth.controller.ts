import { Controller, Post, Body, UseGuards, Req, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully logged in and received access token',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: { $ref: '#/components/schemas/User' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    type: User
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the authenticated user profile',
    type: User
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: { user: User }) {
    return req.user;
  }
}
