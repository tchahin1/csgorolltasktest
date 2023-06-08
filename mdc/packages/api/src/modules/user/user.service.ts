import { Injectable } from '@nestjs/common/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@ankora/models/prisma';
import { isEqual, pick } from 'lodash';
import { ROLE, User } from '@prisma/client';
import { organizationId } from '../../constants/organization';
import { CreatePlayerDto } from './dto/create-user-player.dto';
import { auth } from 'firebase-admin';
import { UpdateUserPlayerDto } from './dto/update-user-player.dto';
import { Coach } from '@ankora/models';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async upsertUser(userData: CreateUserDto, currentUser: User) {
    if (!currentUser && isEqual(userData.role, ROLE.COACH)) {
      return this.createUserWithCoach(userData);
    } else if (!currentUser && isEqual(userData.role, ROLE.PLAYER)) {
      return this.createUserWithPlayer(userData as unknown as CreatePlayerDto);
    }
    return this.prismaService.user.upsert({
      where: {
        id: currentUser.id,
      },
      update: {
        ...userData,
      },
      create: {
        ...userData,
        organizationId: organizationId,
      },
    });
  }

  async createUserWithPlayer(userData: CreatePlayerDto) {
    return this.prismaService.user.create({
      data: {
        email: userData.email,
        phone: userData.phone,
        address: userData.phone,
        city: userData.city,
        zip: userData.zip,
        fullName: userData.fullName,
        organizationId: organizationId,
        role: ROLE.PLAYER,
        Player: {
          create: {
            sex: userData.sex,
            height: userData.height,
            weight: userData.weight,
            plays: userData.plays,
            playerCoaches: {
              createMany: {
                data:
                  userData.coaches?.map((coachId: string) => ({
                    coachId: coachId,
                  })) || [],
              },
            },
          },
        },
      },
      include: {
        Player: {
          include: {
            playerCoaches: true,
          },
        },
      },
    });
  }

  async createUserWithCoach(userData: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        ...userData,
        organizationId: organizationId,
        Coach: {
          create: {},
        },
      },
    });
  }

  async createUser(userData: CreateUserDto) {
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    } else {
      if (isEqual(userData.role, ROLE.PLAYER)) {
        return await this.createUserWithPlayer(
          userData as unknown as CreatePlayerDto,
        );
      } else {
        return await this.createUserWithCoach(userData);
      }
    }
  }

  async getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }
  async getRoleFromUser(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
      select: {
        role: true,
      },
    });
  }

  async createPlayer(playerData: CreatePlayerDto) {
    try {
      await auth().getUserByEmail(playerData.email);
    } catch (e) {
      await auth().createUser({
        email: playerData.email,
        displayName: playerData.fullName,
        password: playerData.password,
      });
    }
    return this.createUserWithPlayer(playerData);
  }

  async updatePlayer(
    playerData: UpdateUserPlayerDto,
    coach: Coach,
    email: string,
  ) {
    const isSuperCoach = coach.user?.role === ROLE.SUPER_COACH;
    const player = await this.prismaService.user.findFirstOrThrow({
      where: {
        AND: [
          {
            email: email,
          },
          {
            organizationId: organizationId,
          },
          {
            OR: [
              {
                Player: {
                  playerCoaches: {
                    some: { coachId: isSuperCoach ? undefined : coach.id },
                  },
                },
              },
              {
                Player: {
                  playerCoaches: { none: {} },
                },
              },
            ],
          },
        ],
      },
      include: {
        Player: {
          include: {
            playerCoaches: true,
          },
        },
      },
    });

    const coachesToDelete = player.Player?.playerCoaches.filter(
      (playerCoach) =>
        !playerData.coaches?.find((coachId) => coachId === playerCoach.coachId),
    );

    const playerCoachesToCreate = playerData.coaches?.filter(
      (coachId) =>
        !player.Player?.playerCoaches.find(
          (playerCoach) => playerCoach.coachId === coachId,
        ),
    );

    if (player) {
      return this.prismaService.user.update({
        where: {
          email: email,
        },
        data: {
          ...pick(
            playerData,
            'email',
            'fullName',
            'phone',
            'address',
            'city',
            'zip',
          ),
          Player: {
            update: {
              ...pick(
                playerData,
                'sex',
                'plays',
                'dateOfBirth',
                'height',
                'weight',
              ),
              playerCoaches: {
                connectOrCreate: playerCoachesToCreate?.map((coach) => ({
                  where: {
                    coachId_playerId: {
                      coachId: coach,
                      playerId: player.id,
                    },
                  },
                  create: {
                    coachId: coach,
                  },
                })),
                deleteMany: {
                  AND: {
                    coachId: {
                      in: coachesToDelete?.map(
                        (playerCoach) => playerCoach.coachId,
                      ),
                    },
                    playerId: player.Player?.id,
                  },
                },
              },
            },
          },
        },
      });
    } else {
      throw new Error('User does not exist');
    }
  }
}
