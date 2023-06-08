import {
  ServeStatistics,
  ServeZonesStatistics,
  ServeStatisticsInfo,
  ServeZonesInfo,
} from '@ankora/models';
import { inRange, reduce } from 'lodash';
import {
  KincubeMatchResult,
  PLAYER_SIDE_LONG,
  TYPE_OF_HIT,
} from '../dto/kincube-result.dto';

import { isPlayerA, isPlayerB } from './common';

export const calculateServeStatistics = (
  results: KincubeMatchResult[],
): ServeStatistics => {
  try {
    const initialData: ServeStatisticsInfo = {
      totalPlayerA: 0,
      totalPlayerB: 0,
      percentagePlayerA: 0,
      percentagePlayerB: 0,
    };

    const allServeHits = results
      .flatMap((result) => result.hits)
      .filter((hit) => hit.type_of_hit.includes('serve'));

    // Calculate total number of first serve hits in match for both players
    const firstServes = reduce(
      allServeHits,
      (total, hit) => {
        let { totalPlayerA, totalPlayerB } = total;
        if (hit.type_of_hit === TYPE_OF_HIT.FIRST_SERVE) {
          if (isPlayerA(hit)) totalPlayerA += 1;
          else totalPlayerB += 1;
        }

        return { ...total, totalPlayerA, totalPlayerB };
      },
      initialData,
    );

    // Calculate total number of second serve hits in match for both players
    const secondServes = reduce(
      allServeHits,
      (total, hit) => {
        let { totalPlayerA, totalPlayerB } = total;
        if (hit.type_of_hit === TYPE_OF_HIT.SECOND_SERVE) {
          if (isPlayerA(hit)) totalPlayerA += 1;
          else if (isPlayerB(hit)) totalPlayerB += 1;
        }

        return { ...total, totalPlayerA, totalPlayerB };
      },
      initialData,
    );

    // Calculate number of both first and second serve in match for both players
    const serves = reduce(
      allServeHits,
      (total, hit) => {
        let { totalPlayerA, totalPlayerB } = total;
        if (isPlayerA(hit)) totalPlayerA += 1;
        else totalPlayerB += 1;

        return { ...total, totalPlayerA, totalPlayerB };
      },
      initialData,
    );

    // Calculate number of aces in both first and second serve in match bor both players
    // Player aced if there are no hit that are not serve in result
    const aces = reduce(
      results,
      (total, result) => {
        let { totalPlayerA, totalPlayerB } = total;

        const serveHits = result.hits.filter((hit) =>
          hit.type_of_hit.includes('serve'),
        );

        if (!serveHits.length) return total;

        const nonServeHits = result.hits.filter(
          (hit) => !hit.type_of_hit.includes('serve'),
        );
        if (!nonServeHits.length) {
          if (isPlayerA(serveHits[0])) totalPlayerA += 1;
          else totalPlayerB += 1;
        }

        return {
          totalPlayerA,
          totalPlayerB,
          percentagePlayerA: (totalPlayerA / serves.totalPlayerA) * 100,
          percentagePlayerB: (totalPlayerB / serves.totalPlayerB) * 100,
        };
      },
      initialData,
    );

    // Calculate number of points that are lost by double serve faults
    const doubleFaults = reduce(
      allServeHits,
      (total, hit) => {
        let { totalPlayerA, totalPlayerB } = total;

        if (
          hit.type_of_hit === TYPE_OF_HIT.SECOND_SERVE &&
          !hit.rebound_after_hit_is_in
        ) {
          if (isPlayerA(hit)) totalPlayerA += 1;
          else totalPlayerB += 1;
        }

        return {
          totalPlayerA,
          totalPlayerB,
          percentagePlayerA: (totalPlayerA / serves.totalPlayerA) * 100,
          percentagePlayerB: (totalPlayerB / serves.totalPlayerB) * 100,
        };
      },
      initialData,
    );

    // Calculate average serve speed for both players
    let serveSpeed = reduce(
      allServeHits,
      (total, hit) => {
        let { totalPlayerA, totalPlayerB } = total;

        if (isPlayerA(hit)) totalPlayerA += hit.speed || 0;
        else totalPlayerB += hit.speed || 0;

        return {
          totalPlayerA: totalPlayerA,
          totalPlayerB: totalPlayerB,
        };
      },
      initialData,
    );
    serveSpeed = {
      totalPlayerA: serveSpeed.totalPlayerA / serves.totalPlayerA,
      totalPlayerB: serveSpeed.totalPlayerB / serves.totalPlayerB,
    };

    // Calculate number of good first serves for both players
    const firstServeIn = reduce(
      allServeHits,
      (total, hit) => {
        let { totalPlayerA, totalPlayerB } = total;

        if (hit.type_of_hit === TYPE_OF_HIT.SECOND_SERVE) return total;

        if (isPlayerA(hit)) totalPlayerA += 1;
        else totalPlayerB += 1;

        return {
          totalPlayerA,
          totalPlayerB,
          percentagePlayerA: (totalPlayerA / firstServes.totalPlayerA) * 100,
          percentagePlayerB: (totalPlayerB / firstServes.totalPlayerB) * 100,
        };
      },
      initialData,
    );

    // Calculate number of good first serves opponent didn't return for both players
    const unreturnedFirstServe = reduce(
      results,
      (total, result) => {
        let { totalPlayerA, totalPlayerB } = total;

        if (result.hits.length <= 2 && result.first_serve) {
          if (
            isPlayerA(result.hits[0]) &&
            result.winner === PLAYER_SIDE_LONG.DOWN
          ) {
            totalPlayerA += 1;
          } else if (
            isPlayerB(result.hits[0]) &&
            result.winner === PLAYER_SIDE_LONG.UP
          ) {
            totalPlayerB += 1;
          }
        }

        return {
          totalPlayerA,
          totalPlayerB,
          percentagePlayerA: (totalPlayerA / firstServes.totalPlayerA) * 100,
          percentagePlayerB: (totalPlayerB / firstServes.totalPlayerB) * 100,
        };
      },
      initialData,
    );

    // Calculate number of points won without second serve for both players
    const firstServeWon = reduce(
      results,
      (total, result) => {
        let { totalPlayerA, totalPlayerB } = total;

        if (result.first_serve) {
          if (
            isPlayerA(result.hits[0]) &&
            result.winner === PLAYER_SIDE_LONG.DOWN
          )
            totalPlayerA += 1;
          else if (
            isPlayerB(result.hits[0]) &&
            result.winner === PLAYER_SIDE_LONG.UP
          )
            totalPlayerB += 1;
        }

        return {
          totalPlayerA,
          totalPlayerB,
          percentagePlayerA: (totalPlayerA / firstServes.totalPlayerA) * 100,
          percentagePlayerB: (totalPlayerB / firstServes.totalPlayerB) * 100,
        };
      },
      initialData,
    );

    // Calculates average speed of second serve for both players
    const secondServeSpeed = reduce(
      allServeHits,
      (total, hit) => {
        let { totalPlayerA, totalPlayerB } = total;

        if (hit.type_of_hit === TYPE_OF_HIT.SECOND_SERVE) {
          if (isPlayerA(hit)) totalPlayerA += hit.speed || 0;
          else totalPlayerB += hit.speed || 0;
        }

        return {
          totalPlayerA: secondServes.totalPlayerA
            ? totalPlayerA / secondServes.totalPlayerA
            : 0,
          totalPlayerB: secondServes.totalPlayerB
            ? totalPlayerB / secondServes.totalPlayerB
            : 0,
        };
      },
      initialData,
    );

    // Calculates number of good second serves for both players
    const secondServeIn = reduce(
      allServeHits,
      (total, hit) => {
        let { totalPlayerA, totalPlayerB } = total;

        if (
          hit.type_of_hit === TYPE_OF_HIT.SECOND_SERVE &&
          hit.rebound_after_hit_is_in
        ) {
          if (isPlayerA(hit)) totalPlayerA += hit.speed || 0;
          else totalPlayerB += 1;
        }

        return {
          totalPlayerA,
          totalPlayerB,
          percentagePlayerA: secondServes.totalPlayerA
            ? (totalPlayerA / secondServes.totalPlayerA) * 100
            : 0,
          percentagePlayerB: secondServes.totalPlayerB
            ? (totalPlayerB / secondServes.totalPlayerB) * 100
            : 0,
        };
      },
      initialData,
    );

    // Calculates number of won points after second serves for both players
    const secondServeWon = reduce(
      results,
      (total, result) => {
        let { totalPlayerA, totalPlayerB } = total;

        if (
          !result.first_serve &&
          result.winner === PLAYER_SIDE_LONG.DOWN &&
          isPlayerA(result.hits[0])
        )
          totalPlayerA += 1;
        else if (
          !result.first_serve &&
          result.winner === PLAYER_SIDE_LONG.UP &&
          isPlayerB(result.hits[0])
        )
          totalPlayerB += 1;

        return {
          totalPlayerA,
          totalPlayerB,
          percentagePlayerA: secondServes.totalPlayerA
            ? (totalPlayerA / secondServes.totalPlayerA) * 100
            : 0,
          percentagePlayerB: secondServes.totalPlayerB
            ? (totalPlayerB / secondServes.totalPlayerB) * 100
            : 0,
        };
      },
      initialData,
    );

    return {
      serves,
      aces,
      doubleFaults,
      serveSpeed,
      firstServeIn,
      unreturnedFirstServe,
      firstServeWon,
      secondServeSpeed,
      secondServeIn,
      secondServeWon,
    };
  } catch (e) {
    return {} as ServeStatistics;
  }
};

const serveZonesPlayerA: Record<string, { from: number; to: number }> = {
  wideAdZone: { from: -1000, to: 2.745 },
  bodyAdZone: { from: 2.765, to: 4.115 },
  tAdZone: { from: 4.115, to: 5.485 },
  tDeuceZone: { from: 5.485, to: 6.855 },
  bodyDeuceZone: { from: 6.855, to: 8.225 },
  wideDeuceZone: { from: 8.225, to: 1000 },
};
const serveZonesPlayerB: Record<string, { from: number; to: number }> = {
  wideDeuceZone: { from: -1000, to: 2.746 },
  bodyDeuceZone: { from: 2.766, to: 4.116 },
  tDeuceZone: { from: 4.116, to: 5.486 },
  tAdZone: { from: 5.486, to: 6.856 },
  bodyAdZone: { from: 6.856, to: 8.226 },
  wideAdZone: { from: 8.226, to: 1000 },
};

export const calculateServeZones = (
  results: KincubeMatchResult[],
): ServeZonesStatistics => {
  try {
    const resultsPlayerA = results.filter(
      (result) => result.server_side_long === PLAYER_SIDE_LONG.DOWN,
    );

    const serveHitsPlayerA = resultsPlayerA
      .map((result) => ({
        ...result.hits.find((hit) => hit.type_of_hit.includes('serve')),
        winner: result.winner,
      }))
      .filter((hit) => !!hit.rebound_after_hit_coordinates);

    const serveWonPlayerA = serveHitsPlayerA
      .filter((hit) => hit.winner === PLAYER_SIDE_LONG.DOWN)
      .map((hit) => ({
        height: hit.rebound_after_hit_coordinates![0],
        width: hit.rebound_after_hit_coordinates![1],
      }));

    const serveLostPlayerA = serveHitsPlayerA
      .filter((hit) => hit.winner === PLAYER_SIDE_LONG.UP)
      .map((hit) => ({
        height: hit.rebound_after_hit_coordinates![0],
        width: hit.rebound_after_hit_coordinates![1],
      }));

    const resultsPlayerB = results.filter(
      (result) => result.server_side_long === PLAYER_SIDE_LONG.UP,
    );

    const serveHitsPlayerB = resultsPlayerB
      .map((result) => ({
        ...result.hits.find((hit) => hit.type_of_hit.includes('serve')),
        winner: result.winner,
      }))
      .filter((hit) => !!hit.rebound_after_hit_coordinates);

    const serveWonPlayerB = serveHitsPlayerB
      .filter((hit) => hit.winner === PLAYER_SIDE_LONG.UP)
      .map((hit) => ({
        height: hit.rebound_after_hit_coordinates![0],
        width: hit.rebound_after_hit_coordinates![1],
      }));

    const serveLostPlayerB = serveHitsPlayerB
      .filter((hit) => hit.winner === PLAYER_SIDE_LONG.DOWN)
      .map((hit) => ({
        height: hit.rebound_after_hit_coordinates![0],
        width: hit.rebound_after_hit_coordinates![1],
      }));

    const serveZoneStatistics: {
      playerA: Record<string, ServeZonesInfo>;
      playerB: Record<string, ServeZonesInfo>;
    } = { playerA: {}, playerB: {} };

    const serveReturnHitsCount = serveHitsPlayerA.length;
    let totalAdPlayerA = 0;
    let totalAdPlayerB = 0;
    let totalDeucePlayerA = 0;
    let totalDeucePlayerB = 0;

    Object.keys(serveZonesPlayerA).forEach((serveZoneKey) => {
      const zoneHitsPlayerA = serveHitsPlayerA.filter((hit) =>
        inRange(
          hit.rebound_after_hit_coordinates?.[1] || 0,
          serveZonesPlayerA[serveZoneKey].from,
          serveZonesPlayerA[serveZoneKey].to,
        ),
      );

      const zoneHitsCountPlayerA = zoneHitsPlayerA.length;
      const zoneHitsPercentagePlayerA =
        (zoneHitsCountPlayerA / serveReturnHitsCount) * 100;
      const zoneHitsWonPlayerA = zoneHitsPlayerA.filter(
        (hit) => hit.winner === PLAYER_SIDE_LONG.DOWN,
      );
      const zoneHitsWonCountPlayerA = zoneHitsWonPlayerA.length;
      const zoneHitsWonPercentagePlayerA = zoneHitsCountPlayerA
        ? (zoneHitsWonCountPlayerA / zoneHitsCountPlayerA) * 100
        : 0;

      serveZoneStatistics.playerA[serveZoneKey] = {
        numberOfHits: zoneHitsCountPlayerA,
        percentageOfHits: zoneHitsPercentagePlayerA,
        percentageWon: zoneHitsWonPercentagePlayerA,
      };

      if (serveZoneKey.includes('Ad')) {
        totalAdPlayerA += zoneHitsPlayerA.length;
      } else {
        totalDeucePlayerA += zoneHitsPlayerA.length;
      }
    });

    Object.keys(serveZonesPlayerB).forEach((serveZoneKey) => {
      const zoneHitsPlayerB = serveHitsPlayerB.filter((hit) =>
        inRange(
          hit.rebound_after_hit_coordinates?.[1] || 0,
          serveZonesPlayerB[serveZoneKey].from,
          serveZonesPlayerB[serveZoneKey].to,
        ),
      );

      const zoneHitsCountPlayerB = zoneHitsPlayerB.length;
      const zoneHitsPercentagePlayerB =
        (zoneHitsCountPlayerB / serveReturnHitsCount) * 100;
      const zoneHitsWonPlayerB = zoneHitsPlayerB.filter(
        (hit) => hit.winner === PLAYER_SIDE_LONG.UP,
      );
      const zoneHitsWonCountPlayerB = zoneHitsWonPlayerB.length;
      const zoneHitsWonPercentagePlayerB = zoneHitsCountPlayerB
        ? (zoneHitsWonCountPlayerB / zoneHitsCountPlayerB) * 100
        : 0;

      serveZoneStatistics.playerB[serveZoneKey] = {
        numberOfHits: zoneHitsCountPlayerB,
        percentageOfHits: zoneHitsPercentagePlayerB,
        percentageWon: zoneHitsWonPercentagePlayerB,
      };

      if (serveZoneKey.includes('Ad')) {
        totalAdPlayerB += zoneHitsPlayerB.length;
      } else {
        totalDeucePlayerB += zoneHitsPlayerB.length;
      }
    });

    return {
      zoneStatistics: serveZoneStatistics,
      serveHitsWon: { playerA: serveWonPlayerA, playerB: serveWonPlayerB },
      serveHitsLost: { playerA: serveLostPlayerA, playerB: serveLostPlayerB },
      totalAd: { playerA: totalAdPlayerA, playerB: totalAdPlayerB },
      totalDeuce: { playerA: totalDeucePlayerA, playerB: totalDeucePlayerB },
    };
  } catch (e) {
    return {} as ServeZonesStatistics;
  }
};
