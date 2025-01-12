import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';

const mediaFolderPath = path.resolve(process.cwd(), 'storage', 'media');

export const saveImage = (
  file: Express.Multer.File,
  baseUrl: string,
): string => {
  if (file.size > 2 * 1024 * 1024) {
    throw new BadRequestException('Image size exceeds 2MB');
  }

  if (!fs.existsSync(mediaFolderPath)) {
    fs.mkdirSync(mediaFolderPath, { recursive: true });
  }

  const randomName = crypto.randomBytes(6).toString('hex');
  const ext = path.extname(file.originalname);
  const fileName = `${randomName}-${new Date().toISOString().split('T')[0]}${ext}`;
  const filePath = path.join(mediaFolderPath, fileName);

  fs.writeFileSync(filePath, file.buffer);
  return `${baseUrl}/image/${fileName}`;
};

export const deleteImage = (imagePath: string) => {
  const filePath = path.resolve(
    process.cwd(),
    'storage',
    'media',
    path.basename(imagePath),
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
