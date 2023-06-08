import { Assessment, Coach, Player, User } from '@ankora/models';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { ROLE } from '@prisma/client';
import { Roles } from '../../decorators/auth.roles.decorator';
import {
  CurrentCoach,
  CurrentPlayer,
  CurrentUser,
} from '../../decorators/currentUser.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { AssessmentService } from './assessment.service';
import { AssessmentAnswersDto } from './dto/add-answers.dto';
import { CreateAssessmentDto } from './dto/create-assessment.dto';

@Controller('assessment')
@ApiTags('Assessment')
@UseGuards(AuthGuard)
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Get('/player')
  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  async getAllAssessmentsForPlayer(
    @CurrentPlayer() player: Player,
    @CurrentUser() user: User,
  ): Promise<Assessment[]> {
    return this.assessmentService.getAllAssessmentsForPlayer(player.id, {
      organizationId: user.organizationId,
    });
  }

  @Get('/coach')
  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  async getAllPlayerAssessmentsForCoach(
    @Param('playerId') playerId: string,
    @CurrentUser() user: User,
  ): Promise<Assessment[]> {
    return this.assessmentService.getAllAssessmentsForPlayer(playerId, {
      organizationId: user.organizationId,
    });
  }

  @Get('/:id/player')
  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  async getAssessmentForPlayer(
    @CurrentPlayer() player: Player,
    @Query('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Assessment> {
    return this.assessmentService.getAssessmentById(id, {
      playerId: player.id,
      organizationId: user.organizationId,
    });
  }

  @Get('/:id/coach')
  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  async getAssessmentForCoach(
    @Query('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Assessment> {
    return this.assessmentService.getAssessmentById(id, {
      organizationId: user.organizationId,
    });
  }

  @Post('')
  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  async createAssessment(
    @CurrentCoach() coach: Coach,
    @CurrentUser() user: User,
    @Body() data: CreateAssessmentDto,
  ): Promise<Assessment> {
    return this.assessmentService.createAssessment(
      user.organizationId,
      coach.id,
      data,
    );
  }

  @Patch('coach/:id')
  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  async addCoachAnswers(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: AssessmentAnswersDto,
  ): Promise<Assessment> {
    return this.assessmentService.addCoachAnswers(
      id,
      user.organizationId,
      data.answers,
    );
  }

  @Patch('player/:id')
  @Roles(ROLE.PLAYER)
  @UseGuards(RolesGuard)
  async addPlayerAnswers(
    @CurrentUser() user: User,
    @CurrentPlayer() player: Player,
    @Param('id') id: string,
    @Body() data: AssessmentAnswersDto,
  ): Promise<Assessment> {
    return this.assessmentService.addPlayerAnswers(
      id,
      player.id,
      user.organizationId,
      data.answers,
    );
  }
}
