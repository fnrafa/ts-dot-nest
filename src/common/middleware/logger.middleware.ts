import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { formatDate } from '@src/common/utils/date.utils';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logFolderPath = path.resolve(process.cwd(), 'storage', 'logs');

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const method = req.method;
      const url = req.url;
      const ip = req.ip || 'Unknown IP';
      const status = res.statusCode;
      const duration = Date.now() - startTime;

      const formattedDate = formatDate(new Date());
      const logFilePath = path.join(
        this.logFolderPath,
        `${formattedDate.split(',')[0].replace(/\//g, '-')}.log`,
      );

      const logMessage = `[${formattedDate}][${ip}][${status}] ${method} ${url} +${duration}ms\n`;

      if (!fs.existsSync(this.logFolderPath)) {
        fs.mkdirSync(this.logFolderPath, { recursive: true });
      }

      console.log(logMessage.trim());
      fs.appendFileSync(logFilePath, logMessage);
    });

    next();
  }
}
