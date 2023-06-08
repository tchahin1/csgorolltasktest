import React from 'react';
import path from 'path';
import { getCurrentCoach } from '../lib/auth.utils';
import { CourtRepository, PlayerRepository } from '@ankora/repository';
import prisma from '../lib/prisma';
import MyPlayers from '../components/modules/MyPlayers/MyPlayers';
import Courts from '../components/modules/Courts/Courts';
path.resolve('./next.config.js');

const getAllPlayers = async () => {
  const coach = await getCurrentCoach();
  const { players } = await PlayerRepository.getAll(prisma, coach, {
    includeSelectOptions: true,
  });

  return players;
};

interface PageProps {
  searchParams: {
    'start-date': string;
    'page-size': string;
    page: string;
    search: string;
    order: string;
    orderKey: string;
  };
}

const Home = async ({ searchParams }: PageProps) => {
  const players = await getAllPlayers();

  const getAllCourts = async () => {
    const coach = await getCurrentCoach();
    const { courts, count: courtsCount } = await CourtRepository.getAll(
      prisma,
      {
        organizationId: coach.user.organizationId,
        page: parseInt(searchParams.page, 10) || 1,
        pageSize: parseInt(searchParams['page-size'], 10) || 10,
        search: searchParams.search,
        order: searchParams.order,
        orderKey: searchParams.orderKey,
      },
    );

    return { courts, courtsCount };
  };

  const { courts, courtsCount } = await getAllCourts();

  return (
    <div className='bg-gray-900 w-full h-full overflow-y-scroll'>
      <Courts courts={JSON.parse(JSON.stringify(courts))} count={courtsCount} />
      <MyPlayers
        players={JSON.parse(JSON.stringify(players))}
        startDate={searchParams['start-date']?.replace(/-/g, '/')}
      />
    </div>
  );
};
export default Home;
