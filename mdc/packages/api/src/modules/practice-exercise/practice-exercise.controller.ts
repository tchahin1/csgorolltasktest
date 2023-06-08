import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorators/auth.roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { PracticeExercise, User } from '@ankora/models';
import {
  Controller,
  Param,
  UseGuards,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { CurrentUser } from '../../decorators/currentUser.decorator';
import { PracticeExerciseService } from './practice-exercise.service';
import { CreateUpdatePracticeExerciseDto } from './dto/create-update-practice-exercise.dto';
import { ROLE } from '@prisma/client';

@Controller('practice-exercise')
@ApiTags('PracticeExercise')
@UseGuards(AuthGuard)
export class PracticeExerciseController {
  constructor(
    private readonly practiceExerciseService: PracticeExerciseService,
  ) {}

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Post('/')
  async create(
    @CurrentUser() user: User,
    @Body() data: CreateUpdatePracticeExerciseDto,
  ): Promise<PracticeExercise> {
    return this.practiceExerciseService.createPracticeExercise(
      data,
      user.organizationId,
    );
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Patch('/update/:id')
  async updateExercise(
    @Param('id') id: string,
    @Body() data: CreateUpdatePracticeExerciseDto,
  ): Promise<PracticeExercise> {
    return this.practiceExerciseService.updatePracticeExercise(data, id);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Delete('/delete/:id')
  async deleteExercise(@Param('id') id: string): Promise<PracticeExercise> {
    return this.practiceExerciseService.deletePracticeExercise(id);
  }
}
