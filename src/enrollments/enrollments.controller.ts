import { Controller, Post, Param, Req, UseGuards, Res } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Response, Request } from 'express';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':courseId')
  async enroll(
    @Param('courseId') courseId: string,
    @Req() req,
    @Res() res: Response,
  ) {
    const enrollment = await this.enrollmentsService.enroll(
      +courseId,
      req.user.id,
    );
    return res
      .status(201)
      .json({ message: 'Kursga yozildingiz', data: enrollment });
  }
}
