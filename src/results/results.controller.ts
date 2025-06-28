import { Controller, Get, UseGuards, Req, Res, Param } from '@nestjs/common';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request, Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { EnrolledGuard } from 'src/shared/guards/entrolled.guard';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @UseGuards(JwtAuthGuard, EnrolledGuard)
  @Get('course/:courseId')
  async getResults(
    @Param('courseId') courseId: string,
    @Req() req: Request & { user: User },
    @Res() res: Response,
  ) {
    const results = await this.resultsService.getResultsForStudent(
      req.user['id'],
    );
    return res.json({ status: 'success', data: results });
  }
}
