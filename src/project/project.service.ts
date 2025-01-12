import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateProjectDto } from '@src/project/dto/create-project.dto';
import { UpdateProjectDto } from '@src/project/dto/update-project.dto';
import { deleteImage, saveImage } from '@src/common/utils/file.utils';
import { createUserLog } from '@src/common/helpers/user-log.helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(
    userId: string,
    dto: CreateProjectDto,
    file: Express.Multer.File,
  ) {
    const coverPath = file
      ? saveImage(file, this.configService.get('BASEURL'))
      : '';

    const type = await this.prisma.type.upsert({
      where: { name: dto.type },
      update: {},
      create: { name: dto.type },
    });

    const languagesArray = dto.languages
      ? dto.languages.split(',').map((lang) => lang.trim())
      : [];

    const languages = languagesArray.length
      ? await Promise.all(
          languagesArray.map(async (lang) => {
            return this.prisma.language.upsert({
              where: { name: lang },
              update: {},
              create: { name: lang },
            });
          }),
        )
      : [];

    const project = await this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        link: dto.link,
        cover: coverPath,
        typeId: type.id,
        languages: { connect: languages.map((lang) => ({ id: lang.id })) },
      },
      include: {
        type: true,
        languages: true,
      },
    });

    await createUserLog(this.prisma, userId, `Created project: ${dto.title}`);
    return project;
  }

  async findAll(
    page: number,
    search: string,
    typeFilter?: string,
    languageFilter?: string,
  ) {
    const limit = 10;
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      title: { contains: search },
      deletedAt: null,
    };

    if (typeFilter) {
      whereCondition.type = {
        name: { contains: typeFilter },
      };
    }

    if (languageFilter) {
      whereCondition.languages = {
        some: {
          name: { contains: languageFilter },
        },
      };
    }

    const totalData = await this.prisma.project.count({
      where: whereCondition,
    });

    const totalPages = Math.ceil(totalData / limit);

    const projects = await this.prisma.project.findMany({
      where: whereCondition,
      include: { type: true, languages: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      totalData,
      currentPage: page,
      totalPages,
      projects,
    };
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateProjectDto,
    file?: Express.Multer.File,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id, deletedAt: null },
    });
    if (!project) throw new NotFoundException('Project not found');

    let coverPath = project.cover;

    if (file) {
      if (project.cover) {
        deleteImage(project.cover);
      }
      coverPath = saveImage(file, this.configService.get('BASEURL'));
    }

    let typeId = project.typeId;
    if (dto.type) {
      const type = await this.prisma.type.upsert({
        where: { name: dto.type },
        update: {},
        create: { name: dto.type },
      });
      typeId = type.id;
    }

    let languageConnect = undefined;
    if (dto.languages && dto.languages.length > 0) {
      const languages = await Promise.all(
        dto.languages.map(async (lang) => {
          return this.prisma.language.upsert({
            where: { name: lang },
            update: {},
            create: { name: lang },
          });
        }),
      );
      languageConnect = { connect: languages.map((lang) => ({ id: lang.id })) };
    }

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        link: dto.link,
        cover: coverPath,
        typeId,
        languages: languageConnect,
      },
      include: { type: true, languages: true },
    });

    await createUserLog(
      this.prisma,
      userId,
      `Updated project: ${updatedProject.title}`,
    );
    return updatedProject;
  }

  async delete(userId: string, id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id, deletedAt: null },
    });
    if (!project) throw new NotFoundException('Project not found');

    await this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await createUserLog(
      this.prisma,
      userId,
      `Deleted project: ${project.title}`,
    );
  }
}
