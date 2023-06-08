import { ContextService, JwtHelper } from '@ankora/core';
import { PrismaService } from '@ankora/models/prisma';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { get } from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtHelper: JwtHelper,
    private readonly prismaService: PrismaService,
    private readonly contextService: ContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const authHeader = this.getAuthHeader(request);

      const token = this.jwtHelper.stripBearer(authHeader);

      const valid = this.jwtHelper.decodePayload(token);

      const user = await this.prismaService.user.findUnique({
        where: {
          email: valid.email as string,
        },
      });
      if (!user) return false;
      this.contextService.userContext = { user };
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private getAuthHeader(request: Request) {
    const authHeader = get(request, 'headers.authorization');
    if (!authHeader) {
      throw new ForbiddenException();
    }
    return authHeader;
  }
}
