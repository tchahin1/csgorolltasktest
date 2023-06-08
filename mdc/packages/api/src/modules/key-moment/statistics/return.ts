import {
  ReturnHitsStatistics,
  HitPositionZoneStatistics,
  ReturnBouncesStatistics,
  BounceZoneStatistics,
} from '@ankora/models';
import { inRange } from 'lodash';
import {
  KincubeMatchResult,
  PLAYER_SIDE_LONG,
} from '../dto/kincube-result.dto';
import { singlesFieldsDimensions } from './constants';

const returnHitZones: Record<string, { from: number; to: number }> = {
  '0': {
    from: 3,
    to: 2,
  },
  '1': {
    from: 2,
    to: 1,
  },
  '2': {
    from: 1,
    to: 0,
  },
  '3': {
    from: 0,
    to: -1,
  },
  '4': {
    from: -1,
    to: -2,
  },
  '5': {
    from: -2,
    to: -3,
  },
  '6': {
    from: -3,
    to: -4,
  },
  '7': {
    from: -4,
    to: -5,
  },
  '8': {
    from: -5,
    to: -6,
  },
  '9': {
    from: -6,
    to: -7,
  },
};

const bouncesZones: Record<string, { from: number; to: number }> = {
  t: { from: 11.88, to: 18.29 },
  body: { from: 18.29, to: 21.1 },
  wide: { from: 21.1, to: 23.77 },
};

const getReturnHits = (results: KincubeMatchResult[]) => {
  // Serve return hits are the ones where opponent is serving and player returned serve - there are multiple hits in result
  const serveReturnResults = results.filter(
    (result) =>
      result.hits.length > 1 &&
      result.server_side_long === PLAYER_SIDE_LONG.UP &&
      !!result.hits.find((hit) => !hit.type_of_hit.includes('serve')),
  );

  const serveReturnHits = serveReturnResults.map((result) => ({
    ...result.hits.find((hit) => !hit.type_of_hit.includes('serve')),
    winner: result.winner,
  }));

  const serveReturnHitsCount = serveReturnHits.length;

  return {
    serveReturnResults,
    serveReturnHits,
    serveReturnHitsCount,
  };
};

export const calculateHitPositionZones = (
  results: KincubeMatchResult[],
): ReturnHitsStatistics => {
  try {
    const { serveReturnHits, serveReturnHitsCount } = getReturnHits(results);

    const serveReturnHitsWon = serveReturnHits
      .filter((hit) => hit.winner === PLAYER_SIDE_LONG.DOWN)
      .map((hit) => {
        return {
          height: hit.hitter_coordinates?.[0] || 0,
          width: hit.hitter_coordinates?.[1] || 0,
        };
      });

    const serveReturnHitsLost = serveReturnHits
      .filter((hit) => hit.winner === PLAYER_SIDE_LONG.UP)
      .map((hit) => {
        return {
          height: hit.hitter_coordinates?.[0] || 0,
          width: hit.hitter_coordinates?.[1] || 0,
        };
      });

    const zoneHitsStatistics: Record<string, HitPositionZoneStatistics> = {};

    Object.keys(returnHitZones).forEach((hitZoneKey) => {
      const zoneHits = serveReturnHits.filter((hit) =>
        inRange(
          hit.hitter_coordinates?.[0] || 0,
          returnHitZones[hitZoneKey].from,
          returnHitZones[hitZoneKey].to,
        ),
      );

      const zoneHitsCount = zoneHits.length;
      const zoneHitsPercentage = (zoneHitsCount / serveReturnHitsCount) * 100;
      const zoneHitsWon = zoneHits.filter(
        (hit) => hit.winner === PLAYER_SIDE_LONG.DOWN,
      );
      const zoneHitsWonCount = zoneHitsWon.length;
      const zoneHitsWonPercentage = zoneHitsCount
        ? (zoneHitsWonCount / zoneHitsCount) * 100
        : 0;

      zoneHitsStatistics[hitZoneKey] = {
        ...returnHitZones[hitZoneKey],
        zoneHitsCount,
        zoneHitsPercentage,
        zoneHitsWonCount,
        zoneHitsWonPercentage,
      };
    });

    return { zoneHitsStatistics, serveReturnHitsWon, serveReturnHitsLost };
  } catch (e) {
    return {} as ReturnHitsStatistics;
  }
};

export const calculateReturnBouncesZones = (
  results: KincubeMatchResult[],
): ReturnBouncesStatistics => {
  try {
    const { serveReturnHits, serveReturnHitsCount } = getReturnHits(results);

    const bounceReturnHitsWon = serveReturnHits
      .filter((hit) => hit.winner === PLAYER_SIDE_LONG.DOWN)
      .map((hit) => {
        return {
          height: hit.rebound_after_hit_coordinates?.[0] || 0,
          width: hit.rebound_after_hit_coordinates?.[1] || 0,
        };
      });

    const bounceReturnHitsLost = serveReturnHits
      .filter((hit) => hit.winner === PLAYER_SIDE_LONG.UP)
      .map((hit) => {
        return {
          height: hit.rebound_after_hit_coordinates?.[0] || 0,
          width: hit.rebound_after_hit_coordinates?.[1] || 0,
        };
      });

    const bounceReturnHitsOut = serveReturnHits.filter(
      (hit) =>
        !hit.rebound_after_hit_is_in &&
        !inRange(
          hit.rebound_after_hit_coordinates?.[0] || 0,
          singlesFieldsDimensions.y.from,
          singlesFieldsDimensions.y.to,
        ) &&
        !inRange(
          hit.rebound_after_hit_coordinates?.[1] || 0,
          singlesFieldsDimensions.x.from,
          singlesFieldsDimensions.x.to,
        ),
    );

    const bounceHitsStatistics: Record<string, BounceZoneStatistics> = {};

    Object.keys(bouncesZones).forEach((bounceZoneKey) => {
      const bounceHits = serveReturnHits.filter((hit) =>
        inRange(
          hit.rebound_after_hit_coordinates?.[0] || 0,
          bouncesZones[bounceZoneKey].from,
          bouncesZones[bounceZoneKey].to,
        ),
      );

      const bounceHitsCount = bounceHits.length;
      const bounceHitsPercentage =
        (bounceHitsCount / serveReturnHitsCount) * 100;
      const bounceHitsWon = bounceHits.filter(
        (hit) => hit.winner === PLAYER_SIDE_LONG.DOWN,
      );
      const bounceHitsWonCount = bounceHitsWon.length;
      const bounceHitsWonPercentage = bounceHitsCount
        ? (bounceHitsWonCount / bounceHitsCount) * 100
        : 0;

      bounceHitsStatistics[bounceZoneKey] = {
        ...bouncesZones[bounceZoneKey],
        bounceHitsCount,
        bounceHitsPercentage,
        bounceHitsWonCount,
        bounceHitsWonPercentage,
      };
    });

    bounceHitsStatistics['out'] = {
      bounceHitsCount: bounceReturnHitsOut.length,
      bounceHitsPercentage:
        (bounceReturnHitsOut.length / serveReturnHitsCount) * 100,
      bounceHitsWonCount: 0,
      bounceHitsWonPercentage: 0,
    };

    return { bounceHitsStatistics, bounceReturnHitsWon, bounceReturnHitsLost };
  } catch (e) {
    return {} as ReturnBouncesStatistics;
  }
};
