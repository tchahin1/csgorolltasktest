import { Session } from '@ankora/models';
import {
  miniClock,
  PlayerPhysical,
  PlayerNet,
  PlayerRallyShots,
  Separator,
  SessionPlayers,
  PlayerBaseline,
  PlayerPlanOfPlay,
  Loader,
} from '@ankora/ui-library';
import { useQuery } from '@tanstack/react-query';
import humanizeDuration from 'humanize-duration';
import Image from 'next/image';
import ReactPlayer from 'react-player';
import { PlayerBounces } from '../PlayerBounces/PlayerBounces';
import { PlayerHitPoints } from '../PlayerHitPoints/PlayerHitPoints';
import { PlayerReturn } from '../PlayerReturn/PlayerReturn';
import { apiClient } from '../../../lib/apiClient';
import { PlayerServe } from '../PlayerServe/PlayerServe';
import { Tabs } from '../Tabs/Tabs';

interface SessionStatsProps {
  session: Session;
}

const SessionStats = ({ session }: SessionStatsProps) => {
  const { data: sessionStats, isLoading } = useQuery(
    ['session-stats'],
    () => apiClient.keyMoment.getKeyMomentForSession({ sessionId: session.id }),
    {
      enabled: !!session.id,
    },
  );

  return (
    <div className='flex w-full h-full flex-col lg:flex-row'>
      <div className='w-1/3 p-6 border-r-2 border-r-gray-600'>
        <div className='w-full h-[315px] rounded-lg overflow-hidden'>
          <ReactPlayer
            url={session.file.url}
            width='100%'
            height='100%'
            controls={true}
            style={{ borderRadius: '24px' }}
          />
        </div>
        <div className='p-3 bg-gray-700 mt-6 rounded-lg'>
          <SessionPlayers
            player={session.player}
            opponent={session?.opponent}
          />
          <Separator variant='dark' className='my-2' />
          <div className='flex justify-center items-center gap-4'>
            {[].map((result) => (
              <p
                key={result}
                className='text-primary-500 text-center font-semibold'
              >
                {result}
              </p>
            ))}
          </div>
          <div className='flex items-center justify-center mt-3'>
            <Image src={miniClock} alt='mini_clock' className='mr-1' />
            <p className='text-white text-xs'>
              {humanizeDuration(session?.file.duration * 1000, {
                largest: 2,
              })}
            </p>
          </div>
        </div>
      </div>
      <div className='w-2/3 py-6 px-4'>
        {isLoading || !sessionStats?.data ? (
          <div className='p-4 flex justify-center items-center h-full'>
            <p className='text-white italic'>The session is loading ...</p>
            <Loader />
          </div>
        ) : (
          <Tabs
            itemClassNames='min-w-[100px]'
            tabs={[
              {
                title: 'Rally shots',
                content: (
                  <PlayerRallyShots
                    session={session}
                    statistics={sessionStats.data?.rallyShots}
                  />
                ),
                key: 'rallyShots',
              },
              {
                title: 'Serve',
                content: (
                  <PlayerServe
                    session={session}
                    serveStatistics={sessionStats?.data?.serve?.serveStatistics}
                    serveZonesStatistics={sessionStats?.data?.serve?.serveZones}
                  />
                ),
                key: 'serve',
              },
              {
                title: 'Return',
                content: (
                  <PlayerReturn
                    session={session}
                    returnHitStatistics={
                      sessionStats?.data?.return?.returnHitPosition
                    }
                    returnBouncesStatistics={
                      sessionStats?.data?.return?.returnBounces
                    }
                  />
                ),
                key: 'return',
              },
              {
                title: 'Baseline',
                content: (
                  <PlayerBaseline
                    session={session}
                    statistics={sessionStats.data?.baseline}
                  />
                ),
                key: 'baseline',
              },
              {
                title: 'Net',
                content: (
                  <PlayerNet
                    session={session}
                    statistics={sessionStats.data?.net}
                  />
                ),
                key: 'net',
              },
              {
                title: 'Physical',
                content: (
                  <PlayerPhysical
                    session={session}
                    statistics={sessionStats.data?.physical}
                  />
                ),
                key: 'physical',
              },
              {
                title: 'Plan of play',
                content: (
                  <PlayerPlanOfPlay
                    session={session}
                    statistics={sessionStats.data?.planOfPlay}
                  />
                ),
                key: 'planOfPlay',
              },
              {
                title: 'Bounces',
                content: (
                  <PlayerBounces
                    session={session}
                    statistics={sessionStats.data?.bounces}
                  />
                ),
                key: 'bounces',
              },
              {
                title: 'Hit points',
                content: (
                  <PlayerHitPoints
                    session={session}
                    statistics={sessionStats.data?.hitPoints}
                  />
                ),
                key: 'hitPoints',
              },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default SessionStats;
