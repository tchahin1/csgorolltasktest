import { Injectable } from '@nestjs/common/decorators';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { ROLE, User } from '@prisma/client';
import { ROLES_KEY } from '../decorators/auth.roles.decorator';
import { ContextService } from '@ankora/core';
import { PrismaService } from '@ankora/models/prisma';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly contextService: ContextService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    // Enable users with SUPER_COACH role to access all resources that COACH role can access to
    if (requiredRoles.includes(ROLE.COACH)) {
      requiredRoles.push(ROLE.SUPER_COACH);
    }

    const user: User = this.contextService.userContext.user as User;
    const userHasRequiredRole = requiredRoles.includes(user.role);

    const isCoach = user.role === ROLE.COACH || user.role === ROLE.SUPER_COACH;

    if (userHasRequiredRole && isCoach) {
      const coach = await this.prismaService.coach.findFirstOrThrow({
        where: { userId: user.id },
      });

      if (!coach) return false;

      this.contextService.coachContext = { coach: { ...coach, user } };
    } else if (userHasRequiredRole && user.role === ROLE.PLAYER) {
      const player = await this.prismaService.player.findFirstOrThrow({
        where: { userId: user.id },
      });

      if (!player) return false;

      this.contextService.playerContext = { player: { ...player, user } };
    }
    return userHasRequiredRole;
  }
}
