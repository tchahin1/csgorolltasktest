import { Coach, Player } from '@ankora/models';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { pick } from 'lodash';

type UserRecord = keyof User;

export const CurrentUser = createParamDecorator(
  (data: UserRecord[], context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return data
      ? pick(request.context.userContext.user, data)
      : request.context.userContext.user;
  },
);

type CoachRecord = keyof Coach;

export const CurrentCoach = createParamDecorator(
  (data: CoachRecord[], context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return data
      ? pick(request.context.coachContext.coach, data)
      : request.context.coachContext.coach;
  },
);

type PlayerRecord = keyof Player;

export const CurrentPlayer = createParamDecorator(
  (data: PlayerRecord[], context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return data
      ? pick(request.context.playerContext.player, data)
      : request.context.playerContext.player;
  },
);
