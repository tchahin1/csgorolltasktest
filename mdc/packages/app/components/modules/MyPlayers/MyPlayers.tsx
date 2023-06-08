'use client';

import { PlayerCard } from '@ankora/ui-library';
import { Appointment, Player } from '@ankora/models';
import MyPlayersEmptyState from './MyPlayersEmptyState';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { ModalComponent } from '@ankora/ui-library';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import DrawerWeeklySchedule from '../PlayerWeeklySchedule/DrawerWeeklySchedule';

interface MyPlayersProps {
  players: Player[];
  startDate: string;
}

const MyPlayers = ({ players, startDate }: MyPlayersProps) => {
  const router = useRouter();
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');

  useEffect(() => {
    router.refresh();
  }, [router]);

  const player = players.find((player) => player.id === selectedPlayer);

  const today = dayjs();
  const isTodayWeekend = today.day() === 0 && today.day() === 6;
  const defaultStartDate = isTodayWeekend
    ? dayjs().add(1, 'weeks').set('day', 1).toDate()
    : dayjs()
        .subtract(today.day() - 1, 'day')
        .toDate();

  const { data: playerAppointments } = useQuery(
    ['appointment', startDate],
    () => {
      return apiClient.appointment.getAllForPlayer({
        playerId: selectedPlayer,
        startDate: startDate || defaultStartDate.toDateString(),
        endDate: dayjs(new Date(startDate || defaultStartDate))
          .add(5, 'days')
          .toDate()
          .toDateString(),
      });
    },
    { enabled: !!selectedPlayer },
  );

  const orderedPlayers = useMemo(() => {
    if (!players) return [];
    return players.sort((a, b) => {
      if (!a.playerAppointments?.length) return 1;
      else if (!b.playerAppointments?.length) return -1;

      return dayjs(a.playerAppointments[0].appointment.startDate).isBefore(
        b.playerAppointments[0].appointment.startDate,
      )
        ? -1
        : 1;
    });
  }, [players]);

  if (!players.length) {
    return <MyPlayersEmptyState />;
  }

  return (
    <div className='w-full h-full p-8'>
      <p className='text-white pb-4 text-lg'>My Players</p>
      <div className='w-fit grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
        {orderedPlayers.map((player: Player) => {
          return (
            <PlayerCard
              key={player.id}
              player={player}
              onClick={() => setSelectedPlayer(player.id)}
            />
          );
        })}
      </div>

      {!!selectedPlayer && (
        <ModalComponent
          isVisible={!!selectedPlayer}
          variant='drawer'
          onClose={() => setSelectedPlayer('')}
          title='WEEK SCHEDULE'
        >
          <DrawerWeeklySchedule
            playerAppointments={
              playerAppointments?.data as unknown as Appointment[]
            }
            player={player}
          />
        </ModalComponent>
      )}
    </div>
  );
};
export default MyPlayers;
