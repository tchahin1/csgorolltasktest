import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Coach, Plan, User } from '@ankora/models';
import { ApiTags } from '@nestjs/swagger';
import { ROLE } from '@prisma/client';
import { Roles } from '../../decorators/auth.roles.decorator';
import {
  CurrentCoach,
  CurrentUser,
} from '../../decorators/currentUser.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { AssignPlanDto } from './dto/assign-plan.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { GetPlansDto } from './dto/get-all-plans.dto';
import { PlanService } from './plan.service';

@Controller('plan')
@ApiTags('Plan')
@UseGuards(AuthGuard)
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/')
  async get(
    @Query() data: GetPlansDto,
    @CurrentCoach() coach: Coach,
  ): Promise<Plan[]> {
    return this.planService.getAll(coach, data);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Post('/')
  async create(
    @Body() data: CreatePlanDto,
    @CurrentCoach() coach: Coach,
    @CurrentUser() user: User,
  ): Promise<Plan> {
    return this.planService.create(coach, data, user.organizationId);
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Patch('/assign-player')
  async assignPlayer(@Body() data: AssignPlanDto): Promise<Plan> {
    return this.planService.assignPlayers(data);
  }
}
