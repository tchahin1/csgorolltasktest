import { BaselineStatistics } from '@ankora/models';
import { reduce } from 'lodash';
import {
  KincubeMatchResult,
  PLAYER_SIDE_LONG,
  TYPE_OF_HIT,
} from '../dto/kincube-result.dto';

export const calculateBaselineStatistics = (
  results: KincubeMatchResult[],
): BaselineStatistics => {
  try {
    const allHits = results.flatMap((result) =>
      result.hits.map((hit) => ({ ...hit, winner: result.winner })),
    );
    const allHitsPlayerA = allHits.filter(
      (hit) => hit.hitter === PLAYER_SIDE_LONG.DOWN,
    );
    const allHitsPlayerB = allHits.filter(
      (hit) => hit.hitter === PLAYER_SIDE_LONG.UP,
    );

    const forehandHitsPlayerA = allHitsPlayerA.filter(
      (hit) => hit.type_of_hit === TYPE_OF_HIT.FOREHAND,
    );
    const forehandHitsPlayerB = allHitsPlayerB.filter(
      (hit) => hit.type_of_hit === TYPE_OF_HIT.FOREHAND,
    );

    const backhandHitsPlayerA = allHitsPlayerA.filter(
      (hit) => hit.type_of_hit === TYPE_OF_HIT.BACKHAND,
    );
    const backhandHitsPlayerB = allHitsPlayerB.filter(
      (hit) => hit.type_of_hit === TYPE_OF_HIT.BACKHAND,
    );

    const forehandHitWinsPlayerA = forehandHitsPlayerA.filter(
      (hit) => hit.hit_winner,
    );
    const forehandHitWinsPlayerB = forehandHitsPlayerB.filter(
      (hit) => hit.hit_winner,
    );

    const backhandHitWinsPlayerA = backhandHitsPlayerA.filter(
      (hit) => hit.hit_winner,
    );
    const backhandHitWinsPlayerB = backhandHitsPlayerB.filter(
      (hit) => hit.hit_winner,
    );

    const forehandHitErrorsPlayerA = forehandHitsPlayerA.filter(
      (hit) => !hit.rebound_after_hit_is_in,
    );
    const forehandHitErrorsPlayerB = forehandHitsPlayerB.filter(
      (hit) => !hit.rebound_after_hit_is_in,
    );

    const backhandHitErrorsPlayerA = backhandHitsPlayerA.filter(
      (hit) => !hit.rebound_after_hit_is_in,
    );
    const backhandHitErrorsPlayerB = backhandHitsPlayerB.filter(
      (hit) => !hit.rebound_after_hit_is_in,
    );

    const baselineStatistics = {
      forehand: {
        playerA: {
          total: forehandHitsPlayerA.length,
          percentage:
            (forehandHitsPlayerA.length / allHitsPlayerA.length) * 100,
        },
        playerB: {
          total: forehandHitsPlayerB.length,
          percentage:
            (forehandHitsPlayerB.length / allHitsPlayerB.length) * 100,
        },
      },
      backhand: {
        playerA: {
          total: backhandHitsPlayerA.length,
          percentage:
            (backhandHitsPlayerA.length / allHitsPlayerA.length) * 100,
        },
        playerB: {
          total: backhandHitsPlayerB.length,
          percentage:
            (backhandHitsPlayerB.length / allHitsPlayerB.length) * 100,
        },
      },
      forehandWin: {
        playerA: {
          total: forehandHitWinsPlayerA.length,
          percentage:
            (forehandHitWinsPlayerA.length / forehandHitsPlayerA.length) * 100,
        },
        playerB: {
          total: forehandHitWinsPlayerB.length,
          percentage:
            (forehandHitWinsPlayerB.length / forehandHitsPlayerB.length) * 100,
        },
      },
      backhandWin: {
        playerA: {
          total: backhandHitWinsPlayerA.length,
          percentage:
            (backhandHitWinsPlayerA.length / backhandHitsPlayerA.length) * 100,
        },
        playerB: {
          total: backhandHitWinsPlayerB.length,
          percentage:
            (backhandHitWinsPlayerB.length / backhandHitsPlayerB.length) * 100,
        },
      },
      forehandError: {
        playerA: {
          total: forehandHitErrorsPlayerA.length,
          percentage:
            (forehandHitErrorsPlayerA.length / forehandHitsPlayerA.length) *
            100,
        },
        playerB: {
          total: forehandHitErrorsPlayerB.length,
          percentage:
            (forehandHitErrorsPlayerB.length / forehandHitsPlayerB.length) *
            100,
        },
      },
      backhandError: {
        playerA: {
          total: backhandHitErrorsPlayerA.length,
          percentage:
            (backhandHitErrorsPlayerA.length / backhandHitsPlayerA.length) *
            100,
        },
        playerB: {
          total: backhandHitErrorsPlayerB.length,
          percentage:
            (backhandHitErrorsPlayerB.length / backhandHitsPlayerB.length) *
            100,
        },
      },
      forehandAvgSpeed: {
        playerA: {
          total:
            reduce(
              forehandHitsPlayerA,
              (result, hit) => result + (hit.speed || 0),
              0,
            ) / forehandHitsPlayerA.length,
          percentage: 0,
        },
        playerB: {
          total:
            reduce(
              forehandHitsPlayerB,
              (result, hit) => result + (hit.speed || 0),
              0,
            ) / forehandHitsPlayerB.length,
          percentage: 0,
        },
      },
      backhandAvgSpeed: {
        playerA: {
          total:
            reduce(
              backhandHitsPlayerA,
              (result, hit) => result + (hit.speed || 0),
              0,
            ) / backhandHitsPlayerA.length,
          percentage: 0,
        },
        playerB: {
          total:
            reduce(
              backhandHitsPlayerB,
              (result, hit) => result + (hit.speed || 0),
              0,
            ) / backhandHitsPlayerB.length,
          percentage: 0,
        },
      },
    };

    return baselineStatistics;
  } catch (e) {
    return {} as BaselineStatistics;
  }
};
