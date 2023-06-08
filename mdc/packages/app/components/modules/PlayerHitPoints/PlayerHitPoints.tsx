import { HitStatistics } from '@ankora/api-client';
import { Session } from '@ankora/models';
import { PointCircle, Separator } from '@ankora/ui-library';
import { calculateMetersToPixelHitPoint } from '../../../helpers/convertMeterToPx';

interface PlayerHitPointsProps {
  session: Session;
  statistics: HitStatistics;
}

export const PlayerHitPoints = ({
  session,
  statistics,
}: PlayerHitPointsProps) => {
  console.log(
    '🚀 ~ file: PlayerHitPoints.tsx:12 ~ PlayerHitPoints ~ statistics:',
    statistics,
  );
  return (
    <div className='p-2'>
      <h2 className='text-white font-semibold text-xl mb-3'>Hit Points</h2>
      <Separator variant='dark' className='mb-3' />
      <div>
        <p className='font-semibold text-white'>
          {session.player.user.fullName}
        </p>
        <div className='flex gap-4 mt-3'>
          <div className='flex gap-2 items-center'>
            <div className='w-3 h-3 rounded-full bg-green-800' />
            <p className='text-white'>Forehand</p>
          </div>
          <div className='flex gap-2 items-center'>
            <div className='w-3 h-3 rounded-full bg-primary-500' />
            <p className='text-white'>Backhand</p>
          </div>
        </div>
        <p className='text-white'>Groundstroke bounces</p>
      </div>
      <div className='overflow-auto mt-6'>
        <div className='relative w-full bg-player-hit-points h-[671px] bg-no-repeat max-w-[871px] mx-auto'>
          <div
            className='border-dashed border-t-4 absolute left-[9%] border-white flex w-full justify-end pt-2 max-w-[730px]'
            style={{ bottom: statistics.avgDept * 42.08 + 132 }}
          >
            <div>
              <p className='font-bold text-white text-lg'>
                {statistics.avgDept.toFixed(2)}m
              </p>
              <p className='font-bold text-white text-lg'>Avg depth</p>
            </div>
          </div>
          {statistics.forehandHits.map((ball) => {
            const { bottom, right } = calculateMetersToPixelHitPoint(
              ball.height,
              ball.width,
            );
            return (
              <PointCircle
                variant='darkgreen'
                key={ball.height}
                bottom={bottom.toString()}
                right={right.toString()}
                flag
              />
            );
          })}
          {statistics.backhandHits.map((ball) => {
            const { bottom, right } = calculateMetersToPixelHitPoint(
              ball.height,
              ball.width,
            );
            return (
              <PointCircle
                variant='green'
                key={ball.height}
                bottom={bottom.toString()}
                right={right.toString()}
                flag
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
