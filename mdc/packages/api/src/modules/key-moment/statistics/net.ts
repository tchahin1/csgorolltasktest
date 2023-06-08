import { NetStatistics } from '@ankora/models';
import { inRange } from 'lodash';
import {
  KincubeMatchResult,
  PLAYER_SIDE_LONG,
  TYPE_OF_HIT,
} from '../dto/kincube-result.dto';
import { courtDimensions } from './constants';

export const calculateNetStatistics = (
  results: KincubeMatchResult[],
): NetStatistics => {
  try {
    const allHits = results.flatMap((result) =>
      result.hits.map((hit) => ({ ...hit, winner: result.winner })),
    );

    const allHitsPlayerA = results
      .flatMap((result) =>
        result.hits.map((hit) => ({ ...hit, winner: result.winner })),
      )
      .filter((hit) => hit.hitter === PLAYER_SIDE_LONG.DOWN);
    const allHitsPlayerB = results
      .flatMap((result) =>
        result.hits.map((hit) => ({ ...hit, winner: result.winner })),
      )
      .filter((hit) => hit.hitter === PLAYER_SIDE_LONG.UP);

    const netApproachHits = allHits.filter((hit) =>
      inRange(
        hit.hitter_coordinates?.[0] || 0,
        courtDimensions.playerA.net.y.from,
        courtDimensions.playerA.net.y.to,
      ),
    );

    const netApproachHitsPlayerA = netApproachHits.filter(
      (hit) => hit.hitter === PLAYER_SIDE_LONG.DOWN,
    );
    const netApproachHitsPlayerB = netApproachHits.filter(
      (hit) => hit.hitter === PLAYER_SIDE_LONG.UP,
    );

    const netApproachHitWinsPlayerA = netApproachHitsPlayerA.filter(
      (hit) => hit.hit_winner,
    );
    const netApproachHitWinsPlayerB = netApproachHitsPlayerB.filter(
      (hit) => hit.hit_winner,
    );

    const netForehandHitsPlayerA = netApproachHitsPlayerA.filter(
      (hit) => hit.type_of_hit === TYPE_OF_HIT.FOREHAND,
    );
    const netForehandHitsPlayerB = netApproachHitsPlayerB.filter(
      (hit) => hit.type_of_hit === TYPE_OF_HIT.FOREHAND,
    );

    const netForehandHitWinsPlayerA = netForehandHitsPlayerA.filter(
      (hit) => hit.hit_winner,
    );
    const netForehandHitWinsPlayerB = netForehandHitsPlayerB.filter(
      (hit) => hit.hit_winner,
    );

    const netBackhandHitsPlayerA = netApproachHitsPlayerA.filter(
      (hit) => hit.type_of_hit === TYPE_OF_HIT.BACKHAND,
    );
    const netBackhandHitsPlayerB = netApproachHitsPlayerB.filter(
      (hit) => hit.type_of_hit === TYPE_OF_HIT.BACKHAND,
    );

    const netBackhandHitWinsPlayerA = netBackhandHitsPlayerA.filter(
      (hit) => hit.hit_winner,
    );
    const netBackhandHitWinsPlayerB = netBackhandHitsPlayerB.filter(
      (hit) => hit.hit_winner,
    );

    const netForehandHitErrorsPlayerA = netForehandHitsPlayerA.filter(
      (hit) => !hit.rebound_after_hit_is_in,
    );
    const netForehandHitErrorsPlayerB = netForehandHitsPlayerB.filter(
      (hit) => !hit.rebound_after_hit_is_in,
    );

    const netBackhandHitErrorsPlayerA = netBackhandHitsPlayerA.filter(
      (hit) => !hit.rebound_after_hit_is_in,
    );
    const netBackhandHitErrorsPlayerB = netBackhandHitsPlayerB.filter(
      (hit) => !hit.rebound_after_hit_is_in,
    );

    const netStatistics = {
      netApproach: {
        playerA: {
          total: netApproachHitsPlayerA.length,
          percentage:
            (netApproachHitsPlayerA.length / allHitsPlayerA.length) * 100,
        },
        playerB: {
          total: netApproachHitsPlayerB.length,
          percentage:
            (netApproachHitsPlayerB.length / allHitsPlayerB.length) * 100,
        },
      },
      netApproachWon: {
        playerA: {
          total: netApproachHitWinsPlayerA.length,
          percentage: netApproachHitsPlayerA.length
            ? (netApproachHitWinsPlayerA.length /
                netApproachHitsPlayerA.length) *
              100
            : 0,
        },
        playerB: {
          total: netApproachHitWinsPlayerB.length,
          percentage: netApproachHitsPlayerB.length
            ? (netApproachHitWinsPlayerB.length /
                netApproachHitsPlayerB.length) *
              100
            : 0,
        },
      },
      forehandVolleyWinner: {
        playerA: {
          total: netForehandHitWinsPlayerA.length,
          percentage: netForehandHitsPlayerA.length
            ? (netForehandHitWinsPlayerA.length /
                netForehandHitsPlayerA.length) *
              100
            : 0,
        },
        playerB: {
          total: netForehandHitWinsPlayerB.length,
          percentage: netForehandHitsPlayerB.length
            ? (netForehandHitWinsPlayerB.length /
                netForehandHitsPlayerB.length) *
              100
            : 0,
        },
      },
      backhandVolleyWinner: {
        playerA: {
          total: netBackhandHitWinsPlayerA.length,
          percentage: netBackhandHitsPlayerA.length
            ? (netBackhandHitWinsPlayerA.length /
                netBackhandHitsPlayerA.length) *
              100
            : 0,
        },
        playerB: {
          total: netBackhandHitWinsPlayerB.length,
          percentage: netBackhandHitsPlayerB.length
            ? (netBackhandHitWinsPlayerB.length /
                netBackhandHitsPlayerB.length) *
              100
            : 0,
        },
      },
      forehandVolleyError: {
        playerA: {
          total: netForehandHitErrorsPlayerA.length,
          percentage: netForehandHitsPlayerA.length
            ? (netForehandHitErrorsPlayerA.length /
                netForehandHitsPlayerA.length) *
              100
            : 0,
        },
        playerB: {
          total: netForehandHitErrorsPlayerB.length,
          percentage: netForehandHitsPlayerB.length
            ? (netForehandHitErrorsPlayerB.length /
                netForehandHitsPlayerB.length) *
              100
            : 0,
        },
      },
      backhandVolleyError: {
        playerA: {
          total: netBackhandHitErrorsPlayerA.length,
          percentage: netBackhandHitsPlayerA.length
            ? (netBackhandHitErrorsPlayerA.length /
                netBackhandHitsPlayerA.length) *
              100
            : 0,
        },
        playerB: {
          total: netBackhandHitErrorsPlayerB.length,
          percentage: netBackhandHitsPlayerB.length
            ? (netBackhandHitErrorsPlayerB.length /
                netBackhandHitsPlayerB.length) *
              100
            : 0,
        },
      },
    };

    return netStatistics;
  } catch (e) {
    return {} as NetStatistics;
  }
};
