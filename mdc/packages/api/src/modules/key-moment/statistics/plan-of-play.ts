import { PLAN_OF_PLAY, PlanOfPlayStatistics } from '@ankora/models';
import { groupBy, inRange } from 'lodash';
import {
  KincubeMatchResult,
  PLAYER_SIDE_LONG,
  TYPE_OF_HIT,
} from '../dto/kincube-result.dto';

const zoneCoordinatesPlayer = {
  deuce: { from: -1000, to: 2.74 },
  mid: { from: 2.74, to: 5.48 },
  ad: { from: 5.48, to: 1000 },
};

const zoneCoordinatesRebound = {
  ad: { from: -1000, to: 2.74 },
  mid: { from: 2.74, to: 5.48 },
  deuce: { from: 5.48, to: 1000 },
};

const plans: Record<
  PLAN_OF_PLAY,
  {
    hitter: { from: number; to: number };
    rebound: { from: number; to: number };
  }
> = {
  [PLAN_OF_PLAY.AD_DEUCE]: {
    hitter: zoneCoordinatesPlayer.ad,
    rebound: zoneCoordinatesRebound.deuce,
  },
  [PLAN_OF_PLAY.AD_MID]: {
    hitter: zoneCoordinatesPlayer.ad,
    rebound: zoneCoordinatesRebound.mid,
  },
  [PLAN_OF_PLAY.AD_AD]: {
    hitter: zoneCoordinatesPlayer.ad,
    rebound: zoneCoordinatesRebound.ad,
  },
  [PLAN_OF_PLAY.DEUCE_DEUCE]: {
    hitter: zoneCoordinatesPlayer.deuce,
    rebound: zoneCoordinatesRebound.deuce,
  },
  [PLAN_OF_PLAY.DEUCE_MID]: {
    hitter: zoneCoordinatesPlayer.deuce,
    rebound: zoneCoordinatesRebound.mid,
  },
  [PLAN_OF_PLAY.DEUCE_AD]: {
    hitter: zoneCoordinatesPlayer.deuce,
    rebound: zoneCoordinatesRebound.ad,
  },
  [PLAN_OF_PLAY.MID_DEUCE]: {
    hitter: zoneCoordinatesPlayer.mid,
    rebound: zoneCoordinatesRebound.deuce,
  },
  [PLAN_OF_PLAY.MID_MID]: {
    hitter: zoneCoordinatesPlayer.mid,
    rebound: zoneCoordinatesRebound.mid,
  },
  [PLAN_OF_PLAY.MID_AD]: {
    hitter: zoneCoordinatesPlayer.mid,
    rebound: zoneCoordinatesRebound.ad,
  },
  [PLAN_OF_PLAY.TOTAL]: {
    hitter: { from: -1000, to: 1000 },
    rebound: { from: -1000, to: 1000 },
  },
};

export const calculatePlanOfPlayStatistics = (
  results: KincubeMatchResult[],
) => {
  try {
    const planOfPlays: PlanOfPlayStatistics = {
      forehand: [],
      backhand: [],
    };

    const allPlayerHits = results
      .flatMap((result) =>
        result.hits.map((hit) => {
          const plan = (Object.keys(plans) as PLAN_OF_PLAY[]).find(
            (key: PLAN_OF_PLAY) =>
              hit.rebound_after_hit_coordinates &&
              inRange(
                hit.hitter_coordinates[1],
                plans[key].hitter.from,
                plans[key].hitter.to,
              ) &&
              inRange(
                hit.rebound_after_hit_coordinates[1],
                plans[key].rebound.from,
                plans[key].rebound.to,
              ),
          );
          return {
            ...hit,
            winner: result.winner === PLAYER_SIDE_LONG.DOWN,
            planOfPlay: plan,
          };
        }),
      )
      .filter((hit) => hit.hitter === PLAYER_SIDE_LONG.DOWN);

    const forehandHits = allPlayerHits.filter(
      (hit) => hit.type_of_hit === TYPE_OF_HIT.FOREHAND,
    );

    const forehandByPlans = groupBy(forehandHits, (hit) => hit.planOfPlay);
    forehandByPlans[PLAN_OF_PLAY.TOTAL] = forehandHits;

    const backhandHits = allPlayerHits.filter(
      (hit) => hit.type_of_hit === TYPE_OF_HIT.BACKHAND,
    );
    const backhandByPlans = groupBy(backhandHits, (hit) => hit.planOfPlay);
    backhandByPlans[PLAN_OF_PLAY.TOTAL] = backhandHits;

    Object.keys(plans).forEach((plan) => {
      const forehandPlanHits = forehandByPlans[plan] || [];
      const backhandPlanHits = backhandByPlans[plan] || [];

      planOfPlays.forehand.push({
        total: forehandPlanHits.length,
        winner: forehandPlanHits.length
          ? (forehandPlanHits.filter((hit) => hit.hit_winner).length /
              forehandPlanHits.length) *
            100
          : 0,
        error: forehandPlanHits.length
          ? (forehandPlanHits.filter((hit) => !hit.rebound_after_hit_is_in)
              .length /
              forehandPlanHits.length) *
            100
          : 0,
        winPercentage:
          (forehandPlanHits.filter((hit) => hit.winner).length /
            results.length) *
          100,
        plan: plan as PLAN_OF_PLAY,
      });

      planOfPlays.backhand.push({
        total: backhandPlanHits.length,
        winner: backhandPlanHits.length
          ? (backhandPlanHits.filter((hit) => hit.hit_winner).length /
              backhandPlanHits.length) *
            100
          : 0,
        error: backhandPlanHits.length
          ? (backhandPlanHits.filter((hit) => !hit.rebound_after_hit_is_in)
              .length /
              backhandPlanHits.length) *
            100
          : 0,
        winPercentage:
          (backhandPlanHits.filter((hit) => hit.winner).length /
            results.length) *
          100,
        plan: plan as PLAN_OF_PLAY,
      });
    });

    return planOfPlays;
  } catch (e) {
    return {};
  }
};
