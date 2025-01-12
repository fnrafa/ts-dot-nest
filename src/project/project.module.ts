import { Module } from '@nestjs/common';
import { ProjectService } from '@src/project/project.service';
import { ProjectController } from '@src/project/project.controller';
import { PrismaModule } from '@src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
