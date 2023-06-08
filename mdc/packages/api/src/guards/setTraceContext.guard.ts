import { UtilsHelper } from '@ankora/common';
import { ContextService, TraceContext } from '@ankora/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SetTraceContextGuard implements CanActivate {
  constructor(
    private readonly contextService: ContextService,
    private readonly utilsHelper: UtilsHelper,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const traceContext = new TraceContext(
      this.utilsHelper.generateTrackingId('RT'),
      request.headers['x-device-traceid'] as string,
    );
    traceContext.setHeaders(request.headers);
    traceContext.method = request.method;
    traceContext.fullUrl = this.utilsHelper.getFullUrlFromRequest(
      request,
      'https',
    );
    traceContext.path = request.path;
    this.contextService.traceContext = traceContext;

    return true;
  }
}
