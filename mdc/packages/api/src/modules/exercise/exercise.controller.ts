import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorators/auth.roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { Exercise, User } from '@ankora/models';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../decorators/currentUser.decorator';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ROLE } from '@prisma/client';
import { GetExerciseDto } from './dto/get-exercise.dto';

@Controller('exercise')
@ApiTags('Exercise')
@UseGuards(AuthGuard)
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Roles(ROLE.SUPER_COACH)
  @UseGuards(RolesGuard)
  @Post('/')
  async create(
    @CurrentUser() user: User,
    @Body() data: CreateExerciseDto,
  ): Promise<Exercise> {
    return this.exerciseService.createExercise(data, user.organizationId);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Patch('/update/:id')
  async updateExercise(
    @Param('id') id: string,
    @Body() data: UpdateExerciseDto,
  ): Promise<Exercise> {
    return this.exerciseService.updateExercise(data, id);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Delete('/delete/:id')
  async deleteExercise(@Param('id') id: string): Promise<Exercise> {
    return this.exerciseService.deleteExercise(id);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/all')
  async getAllForOrganization(
    @CurrentUser() user: User,
    @Query() data: GetExerciseDto,
  ): Promise<Exercise[]> {
    return this.exerciseService.getAll(user.organizationId, data.search);
  }
}
