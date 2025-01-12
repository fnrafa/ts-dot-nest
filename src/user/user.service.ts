import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { UpdatePasswordDto } from '@src/user/dto/update-password.dto';
import { comparePassword, hashPassword } from '@src/common/utils/hash.utils';
import { createUserLog } from '@src/common/helpers/user-log.helper';
import { formatDate } from '@src/common/utils/date.utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordValid = await comparePassword(
      dto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const hashedNewPassword = await hashPassword(dto.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    await createUserLog(this.prisma, userId, 'Changing Password');

    return true;
  }

  async getAllUserLogs() {
    const logs = await this.prisma.log.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return logs.map((log) => ({
      logId: log.id,
      action: log.action,
      time: formatDate(log.createdAt),
      user: {
        id: log.user.id,
        username: log.user.username,
        joinedAt: formatDate(log.user.createdAt),
      },
    }));
  }

  async getUserLogs(userId: string) {
    const logs = await this.prisma.log.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return logs.map((log) => ({
      logId: log.id,
      action: log.action,
      time: formatDate(log.createdAt),
      user: {
        id: log.user.id,
        username: log.user.username,
        joinedAt: formatDate(log.user.createdAt),
      },
    }));
  }
}
