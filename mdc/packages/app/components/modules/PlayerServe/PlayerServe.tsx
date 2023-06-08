import { ServeStatistics, ServeZonesStatistics } from '@ankora/api-client';
import { Session } from '@ankora/models';
import { StatDetails } from '@ankora/ui-library';
import { useMemo } from 'react';
import { Tabs } from '../Tabs/Tabs';
import PlayerServeZone from './PlayerServeZone';

interface PlayerServeProps {
  session: Session;
  serveStatistics: ServeStatistics;
  serveZonesStatistics: ServeZonesStatistics;
}

export const PlayerServe = ({
  session,
  serveStatistics,
  serveZonesStatistics,
}: PlayerServeProps) => {
  const serveStatisticsFormatted = useMemo(
    () =>
      Object.keys(serveStatistics).length
        ? [
            {
              category: 'Aces',
              playerA: `${(serveStatistics.aces.percentagePlayerA || 0).toFixed(
                1,
              )}%`,
              detailsPlayerA: serveStatistics.aces.totalPlayerA.toString(),
              playerB: `${(serveStatistics.aces.percentagePlayerB || 0).toFixed(
                1,
              )}%`,
              detailsPlayerB: serveStatistics.aces.totalPlayerB.toString(),
            },
            {
              category: 'Double Faults',
              playerA: `${(
                serveStatistics.doubleFaults.percentagePlayerA || 0
              ).toFixed(1)}%`,
              detailsPlayerA:
                serveStatistics.doubleFaults.totalPlayerA.toString(),
              playerB: `${(
                serveStatistics.doubleFaults.percentagePlayerB || 0
              ).toFixed(1)}%`,
              detailsPlayerB:
                serveStatistics.doubleFaults.totalPlayerB.toString(),
            },
            {
              category: '1st serve avg speed',
              playerA: `${(
                serveStatistics.serveSpeed.totalPlayerA || 0
              ).toFixed(1)} km/h`,
              playerB: `${(
                serveStatistics.serveSpeed.totalPlayerB || 0
              ).toFixed(1)} km/h`,
            },
            {
              category: '1st serve in',
              playerA: `${(
                serveStatistics.firstServeIn.percentagePlayerA || 0
              ).toFixed(1)}%`,
              detailsPlayerA:
                serveStatistics.firstServeIn.totalPlayerA.toString(),
              playerB: `${(
                serveStatistics.firstServeIn.percentagePlayerB || 0
              ).toFixed(1)}%`,
              detailsPlayerB:
                serveStatistics.firstServeIn.totalPlayerB.toString(),
            },
            {
              category: 'Unreturned 1st serve',
              playerA: `${(
                serveStatistics.unreturnedFirstServe.percentagePlayerA || 0
              ).toFixed(1)}%`,
              detailsPlayerA:
                serveStatistics.unreturnedFirstServe.totalPlayerA.toString(),
              playerB: `${(
                serveStatistics.unreturnedFirstServe.percentagePlayerB || 0
              ).toFixed(1)}%`,
              detailsPlayerB:
                serveStatistics.unreturnedFirstServe.totalPlayerB.toString(),
            },
            {
              category: '1st serve won',
              playerA: `${(
                serveStatistics.firstServeWon.percentagePlayerA || 0
              ).toFixed(1)}%`,
              detailsPlayerA:
                serveStatistics.firstServeWon.totalPlayerA.toString(),
              playerB: `${(
                serveStatistics.firstServeWon.percentagePlayerB || 0
              ).toFixed(1)}%`,
              detailsPlayerB:
                serveStatistics.firstServeWon.totalPlayerB.toString(),
            },
            {
              category: '2nd serve avg speed',
              playerA: `${(
                serveStatistics.secondServeSpeed.totalPlayerA || 0
              ).toFixed(1)} km/h`,
              playerB: `${(
                serveStatistics.secondServeSpeed.totalPlayerB || 0
              ).toFixed(1)} km/h`,
            },
            {
              category: '2nd serve in',
              playerA: `${(
                serveStatistics.secondServeIn.percentagePlayerA || 0
              ).toFixed(1)}%`,
              detailsPlayerA:
                serveStatistics.secondServeIn.totalPlayerA.toString(),
              playerB: `${(
                serveStatistics.secondServeIn.percentagePlayerB || 0
              ).toFixed(1)}%`,
              detailsPlayerB:
                serveStatistics.secondServeIn.totalPlayerB.toString(),
            },
            {
              category: '2nd serve won',
              playerA: `${(
                serveStatistics.secondServeWon.percentagePlayerA || 0
              ).toFixed(1)}%`,
              detailsPlayerA:
                serveStatistics.secondServeWon.totalPlayerA.toString(),
              playerB: `${(
                serveStatistics.secondServeWon.percentagePlayerB || 0
              ).toFixed(1)}%`,
              detailsPlayerB:
                serveStatistics.secondServeWon.totalPlayerB.toString(),
            },
          ]
        : [],

    [serveStatistics],
  );

  return (
    <Tabs
      tabs={[
        {
          title: 'Serve',
          content: (
            <StatDetails
              columnOneTitle={session.player.user.fullName}
              columnTwoTitle={session?.opponent?.user?.fullName || 'Opponent'}
              columnStatTitle='Serve'
              statistics={serveStatisticsFormatted}
            />
          ),
          key: 'serve',
        },
        {
          title: 'Serve zone',
          content: (
            <PlayerServeZone
              session={session}
              statistics={serveZonesStatistics}
            />
          ),
          key: 'serveZone',
        },
      ]}
      secondaryVariant
    />
  );
};
