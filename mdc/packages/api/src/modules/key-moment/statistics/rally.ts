import { reduce } from 'lodash';
import {
  KincubeMatchResult,
  PLAYER_SIDE_LONG,
} from '../dto/kincube-result.dto';

export const calculateRallyShotStatistics = (results: KincubeMatchResult[]) => {
  try {
    const initialData = {
      totalPlayerA: 0,
      totalPlayerB: 0,
      percentagePlayerA: 0,
      percentagePlayerB: 0,
    };

    const getWins = (subResults: KincubeMatchResult[]) => {
      const total = reduce(
        subResults,
        (total, rally) => {
          let { totalPlayerA, totalPlayerB } = total;
          if (rally.winner === PLAYER_SIDE_LONG.DOWN) totalPlayerA += 1;
          else if (rally.winner === PLAYER_SIDE_LONG.UP) totalPlayerB += 1;
          return {
            ...total,
            totalPlayerA,
            totalPlayerB,
          };
        },
        initialData,
      );
      return {
        totalPlayerA: total.totalPlayerA,
        totalPlayerB: total.totalPlayerB,
        percentagePlayerA: Number(
          ((total.totalPlayerA / subResults.length) * 100).toFixed(1),
        ),
        percentagePlayerB: Number(
          ((total.totalPlayerB / subResults.length) * 100).toFixed(1),
        ),
      };
    };

    const hits1to3 = results.filter(
      (rally) => rally.hits.length >= 1 && rally.hits.length <= 3,
    );
    const hits4to6 = results.filter(
      (rally) => rally.hits.length >= 4 && rally.hits.length <= 6,
    );
    const hits7to9 = results.filter(
      (rally) => rally.hits.length >= 7 && rally.hits.length <= 9,
    );

    const hits10plus = results.filter((rally) => rally.hits.length >= 10);

    const totalWinsHits1To3 = getWins(hits1to3);
    const totalWinsHits4To6 = getWins(hits4to6);
    const totalWinsHits7To9 = getWins(hits7to9);
    const totalWinsHits10plus = getWins(hits10plus);

    const getTotalWins = (wins: (typeof initialData)[]) => {
      const totalWins = reduce(
        wins,
        (total, win) => {
          let { totalPlayerA, totalPlayerB } = total;
          totalPlayerA += win.totalPlayerA;
          totalPlayerB += win.totalPlayerB;
          return {
            ...total,
            totalPlayerA,
            totalPlayerB,
          };
        },
        initialData,
      );
      return {
        totalPlayerA: totalWins.totalPlayerA,
        totalPlayerB: totalWins.totalPlayerB,
        percentagePlayerA: Number(
          ((totalWins.totalPlayerA / results.length) * 100).toFixed(1),
        ),
        percentagePlayerB: Number(
          ((totalWins.totalPlayerB / results.length) * 100).toFixed(1),
        ),
      };
    };

    const winnings = getTotalWins([
      totalWinsHits10plus,
      totalWinsHits7To9,
      totalWinsHits4To6,
      totalWinsHits1To3,
    ]);

    const totalWins = {
      '1-3': {
        totalPlayerA: totalWinsHits1To3.totalPlayerA,
        totalPlayerB: totalWinsHits1To3.totalPlayerB,
        percentagePlayerA: totalWinsHits1To3.percentagePlayerA,
        percentagePlayerB: totalWinsHits1To3.percentagePlayerB,
      },

      '4-6': {
        totalPlayerA: totalWinsHits4To6.totalPlayerA,
        totalPlayerB: totalWinsHits4To6.totalPlayerB,
        percentagePlayerA: totalWinsHits4To6.percentagePlayerA,
        percentagePlayerB: totalWinsHits4To6.percentagePlayerB,
      },

      '7-9': {
        totalPlayerA: totalWinsHits7To9.totalPlayerA,
        totalPlayerB: totalWinsHits7To9.totalPlayerB,
        percentagePlayerA: totalWinsHits7To9.percentagePlayerA,
        percentagePlayerB: totalWinsHits7To9.percentagePlayerB,
      },

      '10+': {
        totalPlayerA: totalWinsHits10plus.totalPlayerA,
        totalPlayerB: totalWinsHits10plus.totalPlayerB,
        percentagePlayerA: totalWinsHits10plus.percentagePlayerA,
        percentagePlayerB: totalWinsHits10plus.percentagePlayerB,
      },

      total: {
        totalPlayerA: winnings.totalPlayerA,
        totalPlayerB: winnings.totalPlayerB,
        percentagePlayerA: winnings.percentagePlayerA,
        percentagePlayerB: winnings.percentagePlayerB,
      },
    };

    return totalWins;
  } catch (e) {
    return { '1-3': {}, '4-6': {}, '7-9': {}, '10+': {}, total: {} };
  }
};
