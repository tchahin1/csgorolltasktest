import { AppConfigService } from '@ankora/core';
import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class DevOnlyGuard implements CanActivate {
  constructor(private readonly appConfigService: AppConfigService) {}

  public canActivate(): boolean {
    return !this.appConfigService.isProductionZone;
  }
}
