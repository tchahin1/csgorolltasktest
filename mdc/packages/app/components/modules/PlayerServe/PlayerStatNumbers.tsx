import { ServeZonesInfo } from '@ankora/models';
import { PlayerServeZoneStat } from '@ankora/ui-library';
import { sortBy } from 'lodash';
import { useMemo } from 'react';

interface PlayerStatNumbersProps {
  totalAd: number;
  totalDeuce: number;
  playerStat: Record<string, ServeZonesInfo>;
}

const PlayerStatNumbers = ({
  totalAd,
  totalDeuce,
  playerStat,
}: PlayerStatNumbersProps) => {
  const colors = useMemo(() => {
    const adOptions = sortBy(
      [
        { stat: playerStat.wideAdZone.percentageWon, key: 'wideAdZone' },
        { stat: playerStat.tAdZone.percentageWon, key: 'tAdZone' },
        { stat: playerStat.bodyAdZone.percentageWon, key: 'bodyAdZone' },
      ],
      'stat',
    );
    const deuceOptions = sortBy(
      [
        { stat: playerStat.wideDeuceZone.percentageWon, key: 'wideDeuceZone' },
        { stat: playerStat.tDeuceZone.percentageWon, key: 'tDeuceZone' },
        { stat: playerStat.bodyDeuceZone.percentageWon, key: 'bodyDeuceZone' },
      ],
      'stat',
    );

    const percentageColors = [
      'text-red-400',
      'text-yellow-400',
      'text-primary-500',
    ];

    return Object.keys(playerStat).reduce((colors, statKey) => {
      return {
        ...colors,
        [statKey]: statKey.includes('Ad')
          ? percentageColors[
              adOptions.findIndex((option) => option.key === statKey)
            ]
          : percentageColors[
              deuceOptions.findIndex((option) => option.key === statKey)
            ],
      };
    }, {});
  }, [playerStat]);

  return (
    <div className='absolute left-[106px] w-full top-[360px] max-w-[698px] flex justify-between'>
      <PlayerServeZoneStat
        title='Wide'
        percentage={playerStat.wideDeuceZone.percentageOfHits}
        ratio={`${playerStat.wideDeuceZone.numberOfHits}/${totalDeuce}`}
        winPercentage={playerStat.wideDeuceZone.percentageWon}
        coloration={colors['wideDeuceZone']}
      />
      <PlayerServeZoneStat
        title='Body'
        percentage={playerStat.bodyDeuceZone.percentageOfHits}
        ratio={`${playerStat.bodyDeuceZone.numberOfHits}/${totalDeuce}`}
        winPercentage={playerStat.bodyDeuceZone.percentageWon}
        coloration={colors['bodyDeuceZone']}
      />
      <PlayerServeZoneStat
        title='T'
        percentage={playerStat.tDeuceZone.percentageOfHits}
        ratio={`${playerStat.tDeuceZone.numberOfHits}/${totalDeuce}`}
        winPercentage={playerStat.tDeuceZone.percentageWon}
        coloration={colors['tDeuceZone']}
      />
      <PlayerServeZoneStat
        title='T'
        percentage={playerStat.tAdZone.percentageOfHits}
        ratio={`${playerStat.tAdZone.numberOfHits}/${totalAd}`}
        winPercentage={playerStat.tAdZone.percentageWon}
        coloration={colors['tAdZone']}
      />
      <PlayerServeZoneStat
        title='Body'
        percentage={playerStat.bodyAdZone.percentageOfHits}
        ratio={`${playerStat.bodyAdZone.numberOfHits}/${totalAd}`}
        winPercentage={playerStat.bodyAdZone.percentageWon}
        coloration={colors['bodyAdZone']}
      />
      <PlayerServeZoneStat
        title='Wide'
        percentage={playerStat.wideAdZone.percentageOfHits}
        ratio={`${playerStat.wideAdZone.numberOfHits}/${totalAd}`}
        winPercentage={playerStat.wideAdZone.percentageWon}
        coloration={colors['wideAdZone']}
      />
    </div>
  );
};

export default PlayerStatNumbers;
