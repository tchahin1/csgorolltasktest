import { PlayerBounceStat } from '@ankora/ui-library';

interface PlayerReturnBouncesProps {
  bounceHitsStatistics: Record<
    string,
    {
      bounceHitsCount: number;
      bounceHitsPercentage: number;
      bounceHitsWonCount: number;
      bounceHitsWonPercentage: number;
    }
  >;
  hitsCount: number;
}

const PlayerReturnBouncesStats = ({
  bounceHitsStatistics,
  hitsCount,
}: PlayerReturnBouncesProps) => {
  const getZoneBouncePosition = (key: string) => {
    switch (key) {
      case 't':
        return 'bottom-[80px]';
      case 'body': {
        return 'top-[200px]';
      }
      case 'wide': {
        return 'top-[100px]';
      }
    }
  };

  return (
    <>
      {Object.keys(bounceHitsStatistics).map((zone) =>
        zone === 'out' ? (
          <div key={zone} className='absolute right-[24px] top-[200px]'>
            <p className='text-red-600 font-bold text-lg'>OUT</p>
            <p className='font-semibold text-xs text-gray-300 leading-2'>
              {bounceHitsStatistics['out'].bounceHitsCount}/{hitsCount}
            </p>
            <p className='text-white text-lg font-bold leading-5'>
              {bounceHitsStatistics['out'].bounceHitsPercentage?.toFixed(0)}%
            </p>
          </div>
        ) : (
          <PlayerBounceStat
            key={zone}
            bounceHitStat={bounceHitsStatistics[zone]}
            position={getZoneBouncePosition(zone)}
            hitsCount={hitsCount}
          />
        ),
      )}
    </>
  );
};

export default PlayerReturnBouncesStats;
