import { BounceStatistics } from '@ankora/models';
import { meanBy } from 'lodash';
import {
  KincubeMatchResult,
  PLAYER_SIDE_LONG,
  TYPE_OF_HIT,
} from '../dto/kincube-result.dto';

export const calculateBounceStatistics = (
  results: KincubeMatchResult[],
): BounceStatistics => {
  try {
    const allPlayerHits = results
      .flatMap((result) => result.hits)
      .filter((hit) => hit.hitter === PLAYER_SIDE_LONG.DOWN);

    const forehandHits = allPlayerHits
      .filter((hit) => hit.type_of_hit === TYPE_OF_HIT.FOREHAND)
      .map((hit) => {
        return {
          height: hit.rebound_after_hit_coordinates?.[0] || 0,
          width: hit.rebound_after_hit_coordinates?.[1] || 0,
        };
      });

    const backhandHits = allPlayerHits
      .filter((hit) => hit.type_of_hit === TYPE_OF_HIT.BACKHAND)
      .map((hit) => {
        return {
          height: hit.rebound_after_hit_coordinates?.[0] || 0,
          width: hit.rebound_after_hit_coordinates?.[1] || 0,
        };
      });

    const avgDept = meanBy([...forehandHits, ...backhandHits], 'height');

    return {
      forehandHits,
      backhandHits,
      avgDept,
    };
  } catch (e) {
    return {} as BounceStatistics;
  }
};
