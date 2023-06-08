import { ReturnHitsStatistics } from '@ankora/api-client';
import { Session } from '@ankora/models';
import { PointCircle } from '@ankora/ui-library';
import { calculateMetersToPixelHitPosition } from '../../../helpers/convertMeterToPx';
import PlayerReturnHPStats from './PlayerReturnHPStats';

interface PlayerReturnHitPositionProps {
  session: Session;
  statistics: ReturnHitsStatistics;
}

const PlayerReturnHitPosition = ({
  session,
  statistics,
}: PlayerReturnHitPositionProps) => {
  return (
    <div className='p-2'>
      <div className='flex justify-between items-center'>
        <div>
          <p className='font-bold text-white text-lg'>
            {session.player.user.fullName}
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
          <p className='text-white text-sm'>
            Both first and second serves - Both serve sides
          </p>
        </div>
      </div>

      <div className='overflow-auto mt-6'>
        <div className='relative w-full bg-player-return-hit h-[608px] bg-no-repeat max-w-[871px] mx-auto'>
          <PlayerReturnHPStats
            zoneHitsStatistics={statistics.zoneHitsStatistics}
          />
          {statistics.serveReturnHitsWon.map((ball) => (
            <PointCircle
              variant='green'
              key={ball.height}
              bottom={calculateMetersToPixelHitPosition(
                ball.height,
                ball.width,
              ).bottomPixel.toString()}
              right={calculateMetersToPixelHitPosition(
                ball.height,
                ball.width,
              ).rightPixel.toString()}
            />
          ))}
          {statistics.serveReturnHitsLost.map((ball) => (
            <PointCircle
              variant='red'
              key={ball.height}
              bottom={calculateMetersToPixelHitPosition(
                ball.height,
                ball.width,
              ).bottomPixel.toString()}
              right={calculateMetersToPixelHitPosition(
                ball.height,
                ball.width,
              ).rightPixel.toString()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerReturnHitPosition;
