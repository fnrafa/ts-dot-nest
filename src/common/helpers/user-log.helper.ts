import { PrismaService } from '@src/prisma/prisma.service';

export const createUserLog = async (
  prisma: PrismaService,
  userId: string,
  action: string,
) => {
  await prisma.log.create({
    data: {
      action,
      userId,
    },
  });
};
