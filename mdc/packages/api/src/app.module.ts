import {
  SetGlobalLogContextInterceptor,
  SetClientContextInterceptor,
  TransformInterceptor,
  SystemTimeService,
  UtilsHelper,
  LogRequestStartInterceptor,
} from '@ankora/common';
import { CoreModule } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import {
  BadRequestException,
  Module,
  Scope,
  ValidationPipe,
} from '@nestjs/common';
import { APP_GUARD, APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { SetTraceContextGuard } from './guards/setTraceContext.guard';
import { CoachModule } from './modules/coach/coach.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesGuard } from './guards/auth.roles.guard';
import { FeatureConfigModule } from './modules/feature-config/feature-config.module';
import { PlayerModule } from './modules/player/player.module';
import { UserModule } from './modules/user/user.module';
import { DevModule } from './modules/dev/dev.module';
import { TeamModule } from './modules/team/team.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { apiConfig } from '@ankora/config';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { CourtModule } from './modules/court/court.module';
import { KeyDateModule } from './modules/key-date/key-date.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './modules/cron/cron.module';
import { TournamentModule } from './modules/tournament/tournament.module';
import { ObjectiveModule } from './modules/objective/objective.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { QuestionaryModule } from './modules/questionary/questionary.module';
import { AppController } from './app.controller';
import { ExerciseModule } from './modules/exercise/exercise.module';
import { PracticeExerciseModule } from './modules/practice-exercise/practice-exercise.module';
import { PracticeModule } from './modules/practice/practice.module';
import { PlanModule } from './modules/plan/plan.module';
import { SessionModule } from './modules/session/session.module';
import { FileModule } from './modules/file/file.module';
import { SqsConfig, SqsConfigOption, SqsModule } from '@nestjs-packages/sqs';
import { SqsProducerModule } from './modules/sqs-producer/sqs-producer.module';
import { keyMomentModule } from './modules/key-moment/key-moment.module';

// TODO: Add log request interceptor
@Module({
  imports: [
    JwtModule,
    CoreModule,
    PrismaModule,
    FeatureConfigModule,
    UserModule,
    PlayerModule,
    CoachModule,
    AuthModule,
    DevModule,
    TeamModule,
    CourtModule,
    MailerModule.forRoot({
      transport: {
        host: apiConfig.mailer.host,
        auth: {
          user: apiConfig.mailer.user,
          pass: apiConfig.mailer.pass,
        },
        port: 465,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
      },
    }),
    SqsModule.forRootAsync({
      useFactory: () => {
        const config: SqsConfigOption = {
          region: apiConfig.aws.region,
          endpoint: apiConfig.aws.queueUrl,
          accountNumber: apiConfig.aws.accountNumber,
          credentials: {
            accessKeyId: apiConfig.aws.accessKey,
            secretAccessKey: apiConfig.aws.secretAccessKey,
          },
        };
        return new SqsConfig(config);
      },
    }),

    AppointmentModule,
    KeyDateModule,
    ScheduleModule.forRoot(),
    CronModule,
    TournamentModule,
    ObjectiveModule,
    AssessmentModule,
    QuestionaryModule,
    ExerciseModule,
    PracticeExerciseModule,
    PracticeModule,
    PlanModule,
    SessionModule,
    FileModule,
    SqsProducerModule,
    keyMomentModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      scope: Scope.REQUEST,
      useClass: SetTraceContextGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        exceptionFactory: (validationErrors) =>
          new BadRequestException(validationErrors),
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        errorHttpStatusCode: 422,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: SetGlobalLogContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: SetClientContextInterceptor,
    },

    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LogRequestStartInterceptor,
    },
    SystemTimeService,
    UtilsHelper,
    RolesGuard,
  ],
})
export class AppModule {}
