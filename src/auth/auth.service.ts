import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '@src/auth/dto/register.dto';
import { LoginDto } from '@src/auth/dto/login.dto';
import { comparePassword, hashPassword } from '@src/common/utils/hash.utils';
import { createUserLog } from '@src/common/helpers/user-log.helper';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUser) throw new ConflictException('Username already exists');

    const hashedPassword = await hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      username: user.username,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new NotFoundException('No user found with the provided username.');
    }

    if (!(await comparePassword(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    await createUserLog(this.prisma, user.id, 'Logged in');

    return {
      id: user.id,
      username: user.username,
      token: token,
    };
  }
}
