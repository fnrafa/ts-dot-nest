import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { notFoundResponse } from '@src/common/helpers/response.helper';

@Controller('image')
export class ImageController {
  @Get(':fileName')
  async serveImage(@Param('fileName') fileName: string, @Res() res: Response) {
    const imagePath = path.resolve(process.cwd(), 'storage', 'media', fileName);

    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    } else {
      return res.status(404).json(notFoundResponse('Image not found'));
    }
  }
}
