import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '@ankora/models/prisma';
import { QuestionaryRepository } from '@ankora/repository';

@Injectable()
export class QuestionaryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getLatestQuestionaryForOrganization(organizationId: string) {
    return QuestionaryRepository.getLatestQuestionaryForOrganization(
      this.prismaService,
      organizationId,
    );
  }
}
