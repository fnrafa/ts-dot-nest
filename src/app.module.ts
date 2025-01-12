import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '@src/common/middleware/logger.middleware';
import { ConfigModule } from '@src/config/config.module';
import { PrismaModule } from '@src/prisma/prisma.module';
import { AuthModule } from '@src/auth/auth.module';
import { UserModule } from '@src/user/user.module';
import { ProjectModule } from '@src/project/project.module';
import { ImageModule } from '@src/image/image.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    PrismaModule,
    UserModule,
    ProjectModule,
    ImageModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
