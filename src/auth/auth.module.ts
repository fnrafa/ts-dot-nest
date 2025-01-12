import { Module } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { AuthController } from '@src/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@src/auth/jwt.strategy';
import { PrismaModule } from '@src/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
