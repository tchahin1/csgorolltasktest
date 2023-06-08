import { User } from '@ankora/models';
import { Controller, Get, UseGuards } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../decorators/currentUser.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { QuestionaryService } from './questionary.service';

@Controller('questionary')
@ApiTags('Questionary')
@UseGuards(AuthGuard)
export class QuestionaryController {
  constructor(private readonly questionaryService: QuestionaryService) {}

  @Get('')
  async getLatestQuestionaryForOrganization(@CurrentUser() user: User) {
    return this.questionaryService.getLatestQuestionaryForOrganization(
      user.organizationId,
    );
  }
}
