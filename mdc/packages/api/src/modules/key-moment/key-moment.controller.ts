import { KeyMoment } from '@ankora/models';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ROLE } from '@prisma/client';
import { Roles } from '../../decorators/auth.roles.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/auth.roles.guard';
import { KeyMomentService } from './key-moment.service';
import { KincubeResult } from './dto/kincube-result.dto';

@Controller('key-moment')
@ApiTags('Key Moment')
export class KeyMomentController {
  constructor(private readonly keyMomentService: KeyMomentService) {}

  @Post('/:sessionId')
  async createKeyMoment(
    @Body() body: Record<string, unknown>,
    @Param('sessionId') sessionId: string,
  ): Promise<KeyMoment> {
    return this.keyMomentService.createKeyMoment({
      kincubeData: body as unknown as KincubeResult,
      sessionId,
    });
  }

  @Roles(ROLE.COACH)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get('/:sessionId')
  async getKeyMomentForSession(
    @Param('sessionId') sessionId: string,
  ): Promise<KeyMoment> {
    return this.keyMomentService.getKeyMoment(sessionId);
  }
}
