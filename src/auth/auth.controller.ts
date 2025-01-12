import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { RegisterDto } from '@src/auth/dto/register.dto';
import { LoginDto } from '@src/auth/dto/login.dto';
import {
  createdResponse,
  successResponse,
} from '@src/common/helpers/response.helper';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return createdResponse('User registered successfully', data);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return successResponse('Login successful', data);
  }
}
