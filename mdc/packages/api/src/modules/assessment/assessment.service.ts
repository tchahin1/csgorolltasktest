import { Injectable } from '@nestjs/common/decorators';
import { PrismaService } from '@ankora/models/prisma';
import { AssessmentRepository } from '@ankora/repository';
import { GetAssessmentOptions } from './dto/get-assessment.dto';
import { QuestionaryService } from '../questionary/questionary.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { omit } from 'lodash';
import { ASSESSMENT_STATUS } from '@prisma/client';

@Injectable()
export class AssessmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly questionaryService: QuestionaryService,
  ) {}

  async getAllAssessmentsForPlayer(
    playerId: string,
    options: GetAssessmentOptions,
  ) {
    return AssessmentRepository.getAll(this.prismaService, {
      playerId,
      organizationId: options.organizationId,
    });
  }

  async getAssessmentById(assessmentId: string, options: GetAssessmentOptions) {
    return AssessmentRepository.getOne(
      this.prismaService,
      assessmentId,
      options,
    );
  }

  async createAssessment(
    organizationId: string,
    coachId: string,
    data: CreateAssessmentDto,
  ) {
    const questionary =
      await this.questionaryService.getLatestQuestionaryForOrganization(
        organizationId,
      );
    return this.prismaService.assessment.create({
      data: {
        ...omit(data, 'playerId'),
        questionary: { connect: { id: questionary.id } },
        status: ASSESSMENT_STATUS.WAITING_FOR_PLAYER,
        player: { connect: { id: data.playerId } },
        coach: { connect: { id: coachId } },
        organization: { connect: { id: organizationId } },
      },
    });
  }

  private getUpdatedStatus(status: ASSESSMENT_STATUS) {
    if (status === ASSESSMENT_STATUS.WAITING_FOR_PLAYER)
      return ASSESSMENT_STATUS.WAITING_FOR_COACH;
    return ASSESSMENT_STATUS.COMPLETED;
  }

  async updateAssessmentAnswers(
    id: string,
    answers: Record<string, unknown>[],
    options: {
      playerId?: string;
      organizationId?: string;
      status?: ASSESSMENT_STATUS;
    } = {},
  ) {
    const assessment = await this.prismaService.assessment.findFirstOrThrow({
      where: { id, ...options },
    });
    return this.prismaService.assessment.update({
      where: { id },
      data: {
        answers: JSON.parse(
          JSON.stringify([...assessment.answers, ...answers]),
        ),
        status: this.getUpdatedStatus(assessment.status),
      },
    });
  }

  async addPlayerAnswers(
    id: string,
    playerId: string,
    organizationId: string,
    answers: Record<string, unknown>[],
  ) {
    return this.updateAssessmentAnswers(id, answers, {
      playerId,
      organizationId,
      status: ASSESSMENT_STATUS.WAITING_FOR_PLAYER,
    });
  }

  async addCoachAnswers(
    id: string,
    organizationId: string,
    answers: Record<string, unknown>[],
  ) {
    return this.updateAssessmentAnswers(id, answers, {
      organizationId,
      status: ASSESSMENT_STATUS.WAITING_FOR_COACH,
    });
  }
}
