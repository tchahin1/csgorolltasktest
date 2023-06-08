import {
  CustomSortDto,
  GetCustomSort,
  GetPagination,
  PaginationDto,
} from '@ankora/common';
import { ContextService } from '@ankora/core';
import { Court } from '@ankora/models';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ROLE, User } from '@prisma/client';

import { Roles } from '../../decorators/auth.roles.decorator';
import { CurrentUser } from '../../decorators/currentUser.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { CourtService } from './court.service';
import { GetCourtSearchDto } from './dto/get-courts-search.dto';
import { GetCourtsQueryDto } from './dto/get-courts.dto';

@Controller('court')
@ApiTags('Court')
@UseGuards(AuthGuard)
export class CourtController {
  constructor(
    private readonly courtService: CourtService,
    private readonly contextService: ContextService,
  ) {}

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get()
  async getAvailableCourtsForOrganization(
    @CurrentUser() user: User,
    @Query() query: GetCourtsQueryDto,
  ): Promise<Court[]> {
    return this.courtService.getAvailableCourtsForOrganization(
      user.organizationId,
      query,
    );
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/all')
  async getAllCourtsForOrganization(
    @GetPagination() pagination: PaginationDto,
    @GetCustomSort() sort: CustomSortDto,
    @CurrentUser() user: User,
    @Query() search: GetCourtSearchDto,
  ): Promise<Court[]> {
    this.contextService.addMeta('pageSize', pagination.pageSize);
    this.contextService.addMeta('page', pagination.page);
    const object = await this.courtService.getAllCourtsForOrganization(
      user.organizationId,
      search.search,
      sort.orderKey,
      sort.order,
      pagination.page,
      pagination.pageSize,
    );
    this.contextService.addMeta('count', object.count);
    return object.courts;
  }
  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @Get('/:id')
  async getById(@Param('id') courtId: string): Promise<Court> {
    return this.courtService.getById(courtId);
  }
}
