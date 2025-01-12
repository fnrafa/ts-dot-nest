import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ProjectService } from '@src/project/project.service';
import { CreateProjectDto } from '@src/project/dto/create-project.dto';
import { UpdateProjectDto } from '@src/project/dto/update-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  successResponse,
  createdResponse,
} from '@src/common/helpers/response.helper';
import { Request } from 'express';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  async create(
    @Req() req: Request,
    @Body() dto: CreateProjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = req.user as { userId: string };
    const project = await this.projectService.create(user.userId, dto, file);
    return createdResponse('Project created successfully', project);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('search') search: string = '',
    @Query('type') type: string = '',
    @Query('language') language: string = '',
  ) {
    const result = await this.projectService.findAll(
      page,
      search.toLowerCase(),
      type.toLowerCase(),
      language.toLowerCase(),
    );
    return successResponse('Projects retrieved successfully', result);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('cover'))
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const user = req.user as { userId: string };
    const data = await this.projectService.update(user.userId, id, dto, file);
    return successResponse('Project updated successfully', data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { userId: string };
    await this.projectService.delete(user.userId, id);
    return successResponse('Project deleted successfully');
  }
}
