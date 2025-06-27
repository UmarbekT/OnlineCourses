import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  Get,
  Res,
  Patch,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { ReviewAssignmentDto } from './dto/review-assignment.dto';
import { Request, Response } from 'express';
import { User } from 'src/users/entities/user.entity';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/modules/:moduleId/submit')
  async submit(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateAssignmentDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.assignmentsService.submitAssignment(
      +moduleId,
      req.user?.['id'],
      dto,
    );
    return res.json({ status: 'success', data: result });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/modules/:moduleId')
  async getModuleAssignments(
    @Param('moduleId') moduleId: string,
    @Req() req: Request & { user: User },
    @Res() res: Response,
  ) {
    const assignments =
      await this.assignmentsService.getAssignmentsByModule(+moduleId);
    return res.json({ status: 'success', data: assignments });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  @Patch('/:assignmentId/review')
  async review(
    @Param('assignmentId') assignmentId: string,
    @Body() dto: ReviewAssignmentDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.assignmentsService.reviewAssignment(
      +assignmentId,
      req.user?.['id'],
      dto,
    );
    return res.json({
      status: 'success',
      message: 'Assignment baholandi',
      data: result,
    });
  }
}
