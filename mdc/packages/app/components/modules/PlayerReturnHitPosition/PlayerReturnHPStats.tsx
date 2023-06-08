import { PlayerReturnHPStat } from '@ankora/ui-library';

interface PlayerReturnHPStatsProps {
  zoneHitsStatistics: Record<
    string,
    {
      zoneHitsCount: number;
      zoneHitsPercentage: number;
      zoneHitsWonCount: number;
      zoneHitsWonPercentage: number;
    }
  >;
}

const PlayerReturnHPStats = ({
  zoneHitsStatistics,
}: PlayerReturnHPStatsProps) => {
  return (
    <div className='absolute top-0 z-10'>
      {Object.keys(zoneHitsStatistics).map((zone) => (
        <PlayerReturnHPStat
          key={zone}
          zoneHitsStat={zoneHitsStatistics[zone]}
        />
      ))}
    </div>
  );
};

export default PlayerReturnHPStats;
