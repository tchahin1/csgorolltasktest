import { CoachRepository, PlayerRepository } from '@ankora/repository';
import PlayerTable from '../../components/modules/PlayerTable/PlayerTable';
import { getCurrentCoach } from '../../lib/auth.utils';
import prisma from '../../lib/prisma';

interface PageProps {
  searchParams: {
    page: string;
    pageSize: string;
    search: string;
    order: string;
    orderKey: string;
  };
}

const Players = async ({ searchParams }: PageProps) => {
  const coach = await getCurrentCoach();
  const { players, count: playersCount } = await PlayerRepository.getAll(
    prisma,
    coach,
    {
      search: searchParams.search,
      page: parseInt(searchParams.page, 10) || 1,
      pageSize: parseInt(searchParams['page-size'], 10) || 10,
      order: searchParams.order,
      orderKey: searchParams.orderKey,
    },
  );

  const coaches = await CoachRepository.getAllCoachesForOrganization(
    prisma,
    coach.user.organizationId,
  );

  return (
    <div className='bg-gray-900 pb-32 w-full min-h-full'>
      <PlayerTable
        players={JSON.parse(JSON.stringify(players))}
        coaches={JSON.parse(JSON.stringify(coaches))}
        currentCoach={JSON.parse(JSON.stringify(coach))}
        count={playersCount}
      />
    </div>
  );
};

export default Players;
