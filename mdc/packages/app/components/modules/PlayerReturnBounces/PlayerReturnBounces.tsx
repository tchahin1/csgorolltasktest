import { ReturnBouncesStatistics } from '@ankora/api-client';
import { Session } from '@ankora/models';
import { PointCircle } from '@ankora/ui-library';
import { convertMeterToPixelReturnBounces } from '../../../helpers/convertMeterToPx';
import PlayerReturnBouncesStats from './PlayerReturnBouncesStats';

interface PlayerReturnBouncesProps {
  session: Session;
  statistics: ReturnBouncesStatistics;
}

const PlayerReturnBounces = ({
  session,
  statistics,
}: PlayerReturnBouncesProps) => {
  return (
    <div className='p-2'>
      <p className='text-white text-sm mb-2'>Return bounces from:</p>
      <p className='font-bold text-white text-lg'>
        {session.player.user.fullName}
      </p>
      <p className='text-white text-sm'>
        Both first and second serves - Both serve sides
      </p>

      <div className='overflow-auto mt-6'>
        <div className='relative w-full bg-player-return-bounces h-[572px] bg-no-repeat max-w-[871px] mx-auto'>
          <PlayerReturnBouncesStats
            bounceHitsStatistics={statistics.bounceHitsStatistics}
            hitsCount={
              [
                ...statistics.bounceReturnHitsLost,
                ...statistics.bounceReturnHitsWon,
              ].length
            }
          />
          {statistics.bounceReturnHitsWon.map((ball) => (
            <PointCircle
              variant='green'
              key={ball.height}
              bottom={convertMeterToPixelReturnBounces(
                ball.height,
                ball.width,
              ).bottom.toString()}
              right={convertMeterToPixelReturnBounces(
                ball.height,
                ball.width,
              ).right.toString()}
              flag
            />
          ))}
          {statistics.bounceReturnHitsLost.map((ball) => (
            <PointCircle
              variant='red'
              key={ball.height}
              bottom={convertMeterToPixelReturnBounces(
                ball.height,
                ball.width,
              ).bottom.toString()}
              right={convertMeterToPixelReturnBounces(
                ball.height,
                ball.width,
              ).right.toString()}
              flag
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerReturnBounces;
