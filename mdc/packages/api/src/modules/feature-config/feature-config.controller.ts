import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeatureConfig } from '@ankora/models';
import { FeatureConfigService } from './feature-config.service';

@Controller('feature-config')
@ApiTags('Feature Config')
export class FeatureConfigController {
  constructor(private readonly featureConfigService: FeatureConfigService) {}

  // This is demo route !!
  // Since we are using Next.js in app, all components that are using server-side rendering
  // should call `FeatureConfigRepository.getAll` function instead of this route
  @Get('')
  async getAll(): Promise<FeatureConfig[]> {
    return this.featureConfigService.getAll();
  }
}
