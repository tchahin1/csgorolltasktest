import { PhysicalStatistics } from '@ankora/models';
import {
  KincubeMatchResult,
  PLAYER_SIDE_LONG,
} from '../dto/kincube-result.dto';
import { getDistance } from './common';

export const calculatePhysicalStatistics = (
  results: KincubeMatchResult[],
): PhysicalStatistics => {
  try {
    let distanceTraveledPlayerA = 0;
    let distanceTraveledPlayerB = 0;

    results.forEach((result) => {
      for (let i = 0; i < result.hits.length; i++) {
        if (
          i + 1 < result.hits.length &&
          !!result.hits[i + 1].receiver_coordinates &&
          !!result.hits[i].receiver_coordinates
        ) {
          if (result.hits[i].hitter === PLAYER_SIDE_LONG.DOWN) {
            distanceTraveledPlayerA += getDistance(
              result.hits[i].hitter_coordinates,
              result.hits[i + 1].receiver_coordinates!,
            );
            distanceTraveledPlayerB += getDistance(
              result.hits[i].receiver_coordinates!,
              result.hits[i + 1].hitter_coordinates,
            );
          } else {
            distanceTraveledPlayerA += getDistance(
              result.hits[i].receiver_coordinates!,
              result.hits[i + 1].hitter_coordinates,
            );
            distanceTraveledPlayerB += getDistance(
              result.hits[i].hitter_coordinates,
              result.hits[i + 1].receiver_coordinates!,
            );
          }
        }
      }
    });

    return {
      distanceTraveled: {
        playerA: distanceTraveledPlayerA,
        playerB: distanceTraveledPlayerB,
      },
      distanceTraveledPerHit: {
        playerA: distanceTraveledPlayerA / results.length,
        playerB: distanceTraveledPlayerB / results.length,
      },
    };
  } catch (e) {
    return {} as PhysicalStatistics;
  }
};
