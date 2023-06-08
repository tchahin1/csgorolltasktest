import { UtilsHelper } from '@ankora/common';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DevOnlyGuard } from '../../guards/devOnly.guard';

@Controller('dev')
@UseGuards(DevOnlyGuard)
export class DevController {
  constructor(private readonly utils: UtilsHelper) {}
  @Get('/performance')
  public async performanceCheck(@Query('fail') fail?: string) {
    if (fail === 'true') {
      await this.utils.delay(1500, true);
    }
    return { OK: true };
  }
}
