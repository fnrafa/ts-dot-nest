import { Controller, Patch, Body, UseGuards, Req, Get } from '@nestjs/common';
import { UserService } from '@src/user/user.service';
import { UpdatePasswordDto } from '@src/user/dto/update-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { successResponse } from '@src/common/helpers/response.helper';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-password')
  async updatePassword(@Req() req: Request, @Body() dto: UpdatePasswordDto) {
    const user = req.user as { userId: string };
    await this.userService.updatePassword(user.userId, dto);
    return successResponse('Password updated successfully');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('log/all')
  async getAllUserLogs() {
    const data = await this.userService.getAllUserLogs();
    return successResponse('All activity logs retrieved successfully', data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('log')
  async getUserLogs(@Req() req: Request) {
    const user = req.user as { userId: string };
    const data = await this.userService.getUserLogs(user.userId);
    return successResponse('User activity logs retrieved successfully', data);
  }
}
