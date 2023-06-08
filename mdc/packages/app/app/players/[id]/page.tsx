import { Coach } from '@ankora/models';
import {
  AppointmentRepository,
  AssessmentRepository,
  CoachRepository,
  KeyDateRepository,
  ObjectiveRepository,
  PlayerRepository,
  SessionRepository,
  TournamentRepository,
} from '@ankora/repository';
import dayjs from 'dayjs';
import Head from 'next/head';
import { KeyDates } from '../../../components/modules/KeyDates/KeyDates';
import { MatchAssessments } from '../../../components/modules/MatchAssessments/MatchAssessments';
import { PlayerInformation } from '../../../components/modules/PlayerInformation/PlayerInformation';
import { PlayerObjectives } from '../../../components/modules/PlayerObjectives/PlayerObjectives';
import { PlayerSessions } from '../../../components/modules/PlayerSessions/PlayerSessions';
import PlayerTournaments from '../../../components/modules/PlayerTournaments/PlayerTournaments';
import PlayerWeeklySchedule from '../../../components/modules/PlayerWeeklySchedule/PlayerWeeklySchedule';
import { Tabs } from '../../../components/modules/Tabs/Tabs';
import { getS3SignedUrl } from '../../../helpers/awsFileUpload';
import { getCurrentCoach, getCurrentUser } from '../../../lib/auth.utils';
import prisma from '../../../lib/prisma';

interface PageProps {
  params: {
    id: string;
  };
  searchParams: {
    'start-date': string;
    'page-size': string;
    page: string;
    search: string;
    'assessment-search': string;
    'session-search': string;
  };
}

const getSessions = async (
  currentCoach: Coach,
  search: string,
  playerId: string,
) => {
  const sessions = await SessionRepository.getAllForCoach(
    prisma,
    currentCoach,
    { search, playerId },
  );

  const adjustedSessions = [];
  for await (const session of sessions) {
    if (session.file.key) {
      const privateSessionUrl = (await getS3SignedUrl(
        session.file.key,
      )) as string;
      adjustedSessions.push({
        ...session,
        file: { ...session.file, url: privateSessionUrl },
      });
    } else {
      adjustedSessions.push(session);
    }
  }

  return adjustedSessions;
};

const PlayerOverview = async (props: PageProps) => {
  const today = dayjs();
  const isTodayWeekend = today.day() === 0 && today.day() === 6;
  const defaultStartDate = isTodayWeekend
    ? dayjs().add(1, 'weeks').set('day', 1).toDate()
    : dayjs()
        .subtract(today.day() - 1, 'day')
        .toDate();
  const player = await PlayerRepository.getById(prisma, props.params.id);
  const coach = await getCurrentCoach();
  const keyDates = await KeyDateRepository.getAllByPlayerId(
    prisma,
    coach,
    props.params.id,
  );

  const playerAppointments = await AppointmentRepository.getAllForPlayer(
    prisma,
    props.params.id,
    {
      startDate: new Date(
        props.searchParams['start-date']?.replace(/-/g, '/') ||
          defaultStartDate,
      ),
      endDate: dayjs(
        new Date(
          props.searchParams['start-date']?.replace(/-/g, '/') ||
            defaultStartDate,
        ),
      )
        .add(5, 'days')
        .toDate(),
    },
  );

  const { tournaments, count: tournamentsCount } =
    await TournamentRepository.getAllForPlayer(prisma, props.params.id, {
      page: parseInt(props.searchParams.page, 10) || 1,
      pageSize: parseInt(props.searchParams['page-size'], 10) || 10,
      search: props.searchParams.search,
    });

  const currentUser = await getCurrentUser();
  const currentCoach = await getCurrentCoach();

  const assessments = await AssessmentRepository.getAll(prisma, {
    playerId: props.params.id,
    organizationId: currentUser.organizationId,
    search: props.searchParams['assessment-search'],
  });
  const objectives = await ObjectiveRepository.getAllByPlayerId(
    prisma,
    props.params.id,
  );

  const sessions = await getSessions(
    currentCoach,
    props.searchParams['session-search'],
    props.params.id,
  );

  const coaches = await CoachRepository.getAllCoachesForOrganization(
    prisma,
    currentCoach.user.organizationId,
  );

  return (
    <div className='bg-gray-900 w-full px-8 py-6'>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration = "manual"`,
          }}
        />
      </Head>
      <div className='w-full flex flex-col md:flex-row gap-4'>
        <PlayerInformation
          player={JSON.parse(JSON.stringify(player))}
          coaches={JSON.parse(JSON.stringify(coaches))}
        />
        <div className='w-full md:w-[calc(100%_-_270px)]'>
          <Tabs
            tabs={[
              {
                dataCy: 'Weekly-schedule_tab',
                title: 'Weekly Schedule',
                content: (
                  <PlayerWeeklySchedule
                    playerAppointments={JSON.parse(
                      JSON.stringify(playerAppointments),
                    )}
                    player={JSON.parse(JSON.stringify(player))}
                  />
                ),
                key: 'appointments',
              },
              {
                dataCy: 'Objectives_tab',
                title: 'Objectives',
                content: (
                  <PlayerObjectives
                    objectives={JSON.parse(JSON.stringify(objectives))}
                    playerId={props.params.id}
                  />
                ),
                key: 'objectives',
              },
              {
                title: 'Sessions',
                content: (
                  <PlayerSessions
                    sessions={JSON.parse(JSON.stringify(sessions))}
                    playerId={props.params.id}
                  />
                ),
                key: 'sessions',
              },
              {
                dataCy: 'Match-assessment_tab',
                title: 'Match assessment',
                content: (
                  <MatchAssessments
                    assessments={JSON.parse(JSON.stringify(assessments))}
                    player={JSON.parse(JSON.stringify(player))}
                  />
                ),
                key: 'assessment',
              },
              {
                dataCy: 'Key-dates_tab',
                title: 'Key Dates',
                content: (
                  <KeyDates
                    keyDates={JSON.parse(JSON.stringify(keyDates))}
                    playerId={props.params.id}
                  />
                ),
                key: 'key_dates',
              },
              {
                dataCy: 'Tournament-results_tab',
                title: 'Tournament Results',
                content: (
                  <PlayerTournaments
                    tournaments={JSON.parse(JSON.stringify(tournaments))}
                    count={tournamentsCount}
                  />
                ),
                key: 'tournaments',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
export default PlayerOverview;
