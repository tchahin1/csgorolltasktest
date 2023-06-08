import { ServeZonesStatistics } from '@ankora/api-client';
import { Player, ServeZonesInfo, Session } from '@ankora/models';
import { PointCircle } from '@ankora/ui-library';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import {
  convertMeterToPixelToUpPlayer,
  convertMeterToPixelToDownPlayer,
} from '../../../helpers/convertMeterToPx';
import PlayerStatNumbers from './PlayerStatNumbers';
interface PlayerServeZoneProps {
  session: Session;
  statistics: ServeZonesStatistics;
}

const PlayerServeZone = ({ session, statistics }: PlayerServeZoneProps) => {
  const pointsPlayerWon = useMemo(
    () => statistics?.serveHitsWon?.playerA || [],
    [statistics],
  );

  const pointsPlayerLost = useMemo(
    () => statistics?.serveHitsLost?.playerA || [],
    [statistics],
  );

  const pointsOpponentWon = useMemo(
    () => statistics?.serveHitsWon?.playerB || [],
    [statistics],
  );

  const pointsOpponentLost = useMemo(
    () => statistics?.serveHitsLost?.playerB || [],
    [statistics],
  );

  const [selectedPlayer, setSelectedPlayer] = useState<{
    player?: Player;
    pointsWon: { height: number; width: number }[];
    pointsLost: { height: number; width: number }[];
    zoneStatistics: Record<string, ServeZonesInfo>;
    totalAd: number;
    totalDeuce: number;
  }>({
    player: session.player,
    pointsWon: pointsPlayerWon,
    pointsLost: pointsPlayerLost,
    zoneStatistics: statistics.zoneStatistics.playerA,
    totalAd: statistics.totalAd.playerA,
    totalDeuce: statistics.totalDeuce.playerA,
  });

  return (
    <div className='p-2'>
      <p className='text-white text-xs'>Server selected:</p>
      <div
        className='flex gap-2 items-center mt-3'
        onClick={() =>
          setSelectedPlayer({
            player: session.player,
            pointsWon: pointsPlayerWon,
            pointsLost: pointsPlayerLost,
            zoneStatistics: statistics.zoneStatistics.playerA,
            totalAd: statistics.totalAd.playerA,
            totalDeuce: statistics.totalDeuce.playerA,
          })
        }
      >
        <div
          className={classNames(
            'w-4 h-4 rounded-full flex justify-center items-center bg-gray-700 cursor-pointer',
            { 'bg-primary-600': selectedPlayer.player === session.player },
          )}
        >
          {selectedPlayer.player === session.player && (
            <div className='bg-white w-2 h-2 rounded-full'></div>
          )}
        </div>
        <p className='text-white text-sm cursor-pointer'>
          {session.player?.user?.fullName}
        </p>
      </div>
      <div
        className='flex gap-2 items-center mt-1'
        onClick={() =>
          setSelectedPlayer({
            player: session.opponent,
            pointsWon: pointsOpponentWon,
            pointsLost: pointsOpponentLost,
            zoneStatistics: statistics.zoneStatistics.playerB,
            totalAd: statistics.totalAd.playerB,
            totalDeuce: statistics.totalDeuce.playerB,
          })
        }
      >
        <div
          className={classNames(
            'w-4 h-4 rounded-full flex justify-center items-center bg-gray-700 cursor-pointer',
            { 'bg-primary-600': selectedPlayer.player === session.opponent },
          )}
        >
          {selectedPlayer.player === session.opponent && (
            <div className='bg-white w-2 h-2 rounded-full'></div>
          )}
        </div>
        <p className='text-white text-sm cursor-pointer'>
          {session.opponent?.user?.fullName || 'Opponent'}
        </p>
      </div>
      <div className='overflow-auto mt-6'>
        <div className='relative w-full bg-tennis-court h-[646px] bg-no-repeat max-w-[906px] mx-auto'>
          {selectedPlayer.pointsWon.map((ball) => (
            <PointCircle
              variant='green'
              key={`${ball.width}_${ball.height}`}
              bottom={
                selectedPlayer.player?.id === session.playerId
                  ? convertMeterToPixelToUpPlayer(ball.height, ball.width)
                      .bottom
                  : convertMeterToPixelToDownPlayer(ball.height, ball.width).top
              }
              right={
                selectedPlayer.player?.id === session.playerId
                  ? convertMeterToPixelToUpPlayer(ball.height, ball.width).right
                  : convertMeterToPixelToDownPlayer(ball.height, ball.width)
                      .left
              }
              flag={selectedPlayer.player?.id === session.playerId}
            />
          ))}

          {selectedPlayer.pointsLost.map((ball) => (
            <PointCircle
              key={`${ball.width}_${ball.height}`}
              bottom={
                selectedPlayer.player?.id === session.playerId
                  ? convertMeterToPixelToUpPlayer(ball.height, ball.width)
                      .bottom
                  : convertMeterToPixelToDownPlayer(ball.height, ball.width).top
              }
              right={
                selectedPlayer.player?.id === session.playerId
                  ? convertMeterToPixelToUpPlayer(ball.height, ball.width).right
                  : convertMeterToPixelToDownPlayer(ball.height, ball.width)
                      .left
              }
              flag={selectedPlayer.player?.id === session.playerId}
              variant='red'
            />
          ))}

          <PlayerStatNumbers
            totalAd={selectedPlayer.totalAd}
            totalDeuce={selectedPlayer.totalDeuce}
            playerStat={selectedPlayer.zoneStatistics}
          />

          <div className='absolute bottom-[20px] left-[110px]'>
            <p className='font-bold text-white text-lg'>
              {selectedPlayer.player?.user?.fullName}
            </p>
            <div className='flex gap-4 mt-3'>
              <div className='flex gap-2 items-center'>
                <div className='w-3 h-3 rounded-full bg-primary-500' />
                <p className='text-white'>Points Won</p>
              </div>
              <div className='flex gap-2 items-center'>
                <div className='w-3 h-3 rounded-full bg-red-600' />
                <p className='text-white'>Points Lost</p>
              </div>
            </div>
            <p className='text-white'>Both first and second serves</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerServeZone;
