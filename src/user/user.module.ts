import { Module } from '@nestjs/common';
import { UserService } from '@src/user/user.service';
import { UserController } from '@src/user/user.controller';
import { PrismaModule } from '@src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
