import { testKeyMomentsData } from './dummy-data/kincube-results';
import {
  calculateServeStatistics,
  calculateServeZones,
} from './statistics/serve';
import {
  calculateReturnBouncesZones,
  calculateHitPositionZones,
} from './statistics/return';
import { calculateBaselineStatistics } from './statistics/baseline';
import { calculateNetStatistics } from './statistics/net';
import { calculatePhysicalStatistics } from './statistics/physical';
import { calculatePlanOfPlayStatistics } from './statistics/plan-of-play';
import { calculateBounceStatistics } from './statistics/bounces';
import { calculateHitStatistics } from './statistics/hit';
import { calculateRallyShotStatistics } from './statistics/rally';

describe('Statistics', () => {
  it('should calculate serve stats', async () => {
    const serveStats = calculateServeStatistics(testKeyMomentsData.result);
    expect(serveStats).toMatchObject({
      serves: {
        totalPlayerA: 6,
        totalPlayerB: 6,
      },
      aces: {
        totalPlayerA: 2,
        totalPlayerB: 2,
      },
      doubleFaults: {
        totalPlayerA: 0,
        totalPlayerB: 0,
      },
      serveSpeed: {
        totalPlayerB: 88,
      },
      firstServeIn: {
        totalPlayerA: 6,
        totalPlayerB: 5,
      },
      unreturnedFirstServe: {
        totalPlayerA: 2,
        totalPlayerB: 2,
      },
      firstServeWon: {
        totalPlayerA: 5,
        totalPlayerB: 4,
      },
      secondServeSpeed: {
        totalPlayerA: 0,
        totalPlayerB: 102,
      },
      secondServeIn: {
        totalPlayerA: 0,
        totalPlayerB: 1,
      },
      secondServeWon: {
        totalPlayerA: 0,
        totalPlayerB: 1,
      },
    });
  });

  it('should calculate serve zones', () => {
    const zones = calculateServeZones(testKeyMomentsData.result);

    expect(zones).toMatchObject({
      zoneStatistics: {
        playerA: {
          wideAdZone: {
            numberOfHits: 1,
            percentageWon: 100,
          },
          bodyAdZone: {
            numberOfHits: 0,
            percentageOfHits: 0,
            percentageWon: 0,
          },
          tAdZone: { numberOfHits: 0, percentageOfHits: 0, percentageWon: 0 },
          tDeuceZone: {
            numberOfHits: 1,
            percentageWon: 100,
          },
          bodyDeuceZone: {
            numberOfHits: 2,
            percentageWon: 100,
          },
          wideDeuceZone: {
            numberOfHits: 1,
            percentageWon: 100,
          },
        },
        playerB: {
          wideDeuceZone: {
            numberOfHits: 1,
            percentageWon: 100,
          },
          bodyDeuceZone: {
            numberOfHits: 0,
            percentageOfHits: 0,
            percentageWon: 0,
          },
          tDeuceZone: {
            numberOfHits: 2,
            percentageWon: 100,
          },
          tAdZone: { numberOfHits: 0, percentageOfHits: 0, percentageWon: 0 },
          bodyAdZone: {
            numberOfHits: 2,
            percentageWon: 100,
          },
          wideAdZone: {
            numberOfHits: 0,
            percentageOfHits: 0,
            percentageWon: 0,
          },
        },
      },
      serveHitsWon: {
        playerA: [
          { height: 18.285, width: 2.195238008171542 },
          { height: 18.285, width: 9.6 },
          { height: 17.329248081301273, width: 5.485 },
          { height: 18.285, width: 7.043266689992005 },
          { height: 16.611694174431005, width: 7.552897632032788 },
        ],
        playerB: [
          { height: 6.635130875297634, width: 7.02118473670656 },
          { height: 5.485, width: 2.4373104331805826 },
          { height: 6.026029603567571, width: 5.485 },
          { height: 8.419255822675847, width: 7.47699332817328 },
          { height: 5.485, width: 4.327456670020656 },
        ],
      },
      serveHitsLost: {
        playerA: [{ height: 18.27003699240184, width: 2.750003747591218 }],
        playerB: [],
      },
      totalAd: { playerA: 1, playerB: 2 },
      totalDeuce: { playerA: 4, playerB: 3 },
    });
  });

  it('should calculate serve return zones', () => {
    const returnZones = calculateHitPositionZones(testKeyMomentsData.result);

    expect(returnZones).toMatchObject({
      zoneHitsStatistics: {
        '0': {
          from: 3,
          to: 2,
          zoneHitsCount: 0,
          zoneHitsPercentage: 0,
          zoneHitsWonCount: 0,
          zoneHitsWonPercentage: 0,
        },
        '1': {
          from: 2,
          to: 1,
          zoneHitsCount: 0,
          zoneHitsPercentage: 0,
          zoneHitsWonCount: 0,
          zoneHitsWonPercentage: 0,
        },
        '2': {
          from: 1,
          to: 0,
          zoneHitsCount: 0,
          zoneHitsPercentage: 0,
          zoneHitsWonCount: 0,
          zoneHitsWonPercentage: 0,
        },
        '3': {
          from: 0,
          to: -1,
          zoneHitsCount: 1,
          zoneHitsPercentage: 25,
          zoneHitsWonCount: 0,
          zoneHitsWonPercentage: 0,
        },
        '4': {
          from: -1,
          to: -2,
          zoneHitsCount: 1,
          zoneHitsPercentage: 25,
          zoneHitsWonCount: 0,
          zoneHitsWonPercentage: 0,
        },
        '5': {
          from: -2,
          to: -3,
          zoneHitsCount: 2,
          zoneHitsPercentage: 50,
          zoneHitsWonCount: 0,
          zoneHitsWonPercentage: 0,
        },
        '6': {
          from: -3,
          to: -4,
          zoneHitsCount: 0,
          zoneHitsPercentage: 0,
          zoneHitsWonCount: 0,
          zoneHitsWonPercentage: 0,
        },
        '7': {
          from: -4,
          to: -5,
          zoneHitsCount: 0,
          zoneHitsPercentage: 0,
          zoneHitsWonCount: 0,
          zoneHitsWonPercentage: 0,
        },
        '8': {
          from: -5,
          to: -6,
          zoneHitsCount: 0,
          zoneHitsPercentage: 0,
          zoneHitsWonCount: 0,
          zoneHitsWonPercentage: 0,
        },
        '9': {
          from: -6,
          to: -7,
          zoneHitsCount: 0,
          zoneHitsPercentage: 0,
          zoneHitsWonCount: 0,
          zoneHitsWonPercentage: 0,
        },
      },
      serveReturnHitsWon: [],
      serveReturnHitsLost: [
        { height: -2.5893359467472727, width: 8.624494609950858 },
        { height: -1.233540446550293, width: 3.5268123208298725 },
        { height: -2.116164916280683, width: 8.612902937550619 },
        { height: -0.6029046652260577, width: 3.2885693654503947 },
      ],
    });
  });

  it('should calculate return bounce statistics', () => {
    const bounces = calculateReturnBouncesZones(testKeyMomentsData.result);

    expect(bounces).toMatchObject({
      bounceHitsStatistics: {
        t: {
          from: 11.88,
          to: 18.29,
          bounceHitsCount: 1,
          bounceHitsPercentage: 25,
          bounceHitsWonCount: 0,
          bounceHitsWonPercentage: 0,
        },
        body: {
          from: 18.29,
          to: 21.1,
          bounceHitsCount: 1,
          bounceHitsPercentage: 25,
          bounceHitsWonCount: 0,
          bounceHitsWonPercentage: 0,
        },
        wide: {
          from: 21.1,
          to: 23.77,
          bounceHitsCount: 1,
          bounceHitsPercentage: 25,
          bounceHitsWonCount: 0,
          bounceHitsWonPercentage: 0,
        },
        out: {
          bounceHitsCount: 0,
          bounceHitsPercentage: 0,
          bounceHitsWonCount: 0,
          bounceHitsWonPercentage: 0,
        },
      },
      bounceReturnHitsWon: [],
      bounceReturnHitsLost: [
        { height: 21.004707687139444, width: 2.112422865724404 },
        { height: 17.98198425873331, width: 8.273492807292945 },
        { height: 26.522286273766536, width: 6.08539523993726 },
        { height: 23.206089963000625, width: 2.5794931242379184 },
      ],
    });
  });

  it('should calculate baseline statistics', () => {
    const baseline = calculateBaselineStatistics(testKeyMomentsData.result);
    expect(baseline).toMatchObject({
      forehand: {
        playerA: { total: 8 },
        playerB: { total: 12 },
      },
      backhand: {
        playerA: { total: 11 },
        playerB: { total: 5 },
      },
      forehandWin: {
        playerA: { total: 0 },
        playerB: { total: 0 },
      },
      backhandWin: {
        playerA: { total: 1 },
        playerB: { total: 0 },
      },
      forehandError: {
        playerA: { total: 2 },
        playerB: { total: 1 },
      },
      backhandError: {
        playerA: { total: 3 },
        playerB: { total: 1 },
      },
    });
  });

  it('should calculate net statistics', () => {
    const net = calculateNetStatistics(testKeyMomentsData.result);
    expect(net).toMatchObject({
      netApproach: {
        playerA: { total: 0, percentage: 0 },
        playerB: { total: 0, percentage: 0 },
      },
      netApproachWon: {
        playerA: { total: 0, percentage: 0 },
        playerB: { total: 0, percentage: 0 },
      },
      forehandVolleyWinner: {
        playerA: { total: 0, percentage: 0 },
        playerB: { total: 0, percentage: 0 },
      },
      backhandVolleyWinner: {
        playerA: { total: 0, percentage: 0 },
        playerB: { total: 0, percentage: 0 },
      },
      forehandVolleyError: {
        playerA: { total: 0, percentage: 0 },
        playerB: { total: 0, percentage: 0 },
      },
      backhandVolleyError: {
        playerA: { total: 0, percentage: 0 },
        playerB: { total: 0, percentage: 0 },
      },
    });
  });

  it('should calculate physical statistics', () => {
    const physical = calculatePhysicalStatistics(testKeyMomentsData.result);

    expect(physical.distanceTraveled.playerA.toFixed(2)).toEqual('41.79');
    expect(physical.distanceTraveled.playerB.toFixed(2)).toEqual('74.63');
    expect(physical.distanceTraveledPerHit.playerA.toFixed(2)).toEqual('3.48');
    expect(physical.distanceTraveledPerHit.playerB.toFixed(2)).toEqual('6.22');
  });

  it('should calculate plan of play', () => {
    const planOfPlay = calculatePlanOfPlayStatistics(testKeyMomentsData.result);

    expect(planOfPlay).toMatchObject({
      forehand: [
        {
          total: 2,
          winner: 0,
          error: 0,
          winPercentage: 0,
          plan: 'ad_deuce',
        },
        { total: 0, winner: 0, error: 0, winPercentage: 0, plan: 'ad_mid' },
        { total: 1, winner: 0, error: 0, winPercentage: 0, plan: 'ad_ad' },
        {
          total: 0,
          winner: 0,
          error: 0,
          winPercentage: 0,
          plan: 'deuce_deuce',
        },
        {
          total: 0,
          winner: 0,
          error: 0,
          winPercentage: 0,
          plan: 'deuce_mid',
        },
        {
          total: 1,
          winner: 0,
          error: 100,
          winPercentage: 0,
          plan: 'deuce_ad',
        },
        {
          total: 1,
          winner: 0,
          error: 0,
          winPercentage: 0,
          plan: 'mid_deuce',
        },
        {
          total: 2,
          winner: 0,
          error: 0,
          plan: 'mid_mid',
        },
        {
          total: 1,
          winner: 0,
          error: 100,
          winPercentage: 0,
          plan: 'mid_ad',
        },
        {
          total: 8,
          winner: 0,
          error: 25,
          plan: 'total',
        },
      ],
      backhand: [
        {
          total: 9,
          winPercentage: 25,
          plan: 'ad_deuce',
        },
        {
          total: 1,
          winner: 0,
          error: 0,
          plan: 'ad_mid',
        },
        { total: 0, winner: 0, error: 0, winPercentage: 0, plan: 'ad_ad' },
        {
          total: 0,
          winner: 0,
          error: 0,
          winPercentage: 0,
          plan: 'deuce_deuce',
        },
        {
          total: 0,
          winner: 0,
          error: 0,
          winPercentage: 0,
          plan: 'deuce_mid',
        },
        {
          total: 0,
          winner: 0,
          error: 0,
          winPercentage: 0,
          plan: 'deuce_ad',
        },
        {
          total: 0,
          winner: 0,
          error: 0,
          winPercentage: 0,
          plan: 'mid_deuce',
        },
        {
          total: 0,
          winner: 0,
          error: 0,
          winPercentage: 0,
          plan: 'mid_mid',
        },
        { total: 1, winner: 0, error: 0, winPercentage: 0, plan: 'mid_ad' },
        {
          total: 11,
          plan: 'total',
        },
      ],
    });
  });

  it('should calculate groundstroke bounces', () => {
    const bounces = calculateBounceStatistics(testKeyMomentsData.result);
    expect(bounces).toMatchObject({
      forehandHits: [
        { height: 21.004707687139444, width: 2.112422865724404 },
        { height: 21.63831366175295, width: 5.808071139591027 },
        { height: 17.98198425873331, width: 8.273492807292945 },
        { height: 20.12771767612365, width: 0.9124908615269269 },
        { height: 23.62130666002871, width: 3.0217460267037604 },
        { height: 17.847327075361893, width: 1.37 },
        { height: 22.33507470851548, width: 3.1909638862195666 },
        { height: 22.931576815350205, width: 8.465178725625501 },
      ],
      backhandHits: [
        { height: 22.936985109127026, width: 6.244855272946788 },
        { height: 22.079123937045665, width: 10.302393956879396 },
        { height: 23.77, width: 6.088574280686573 },
        { height: 19.633476027900908, width: 4.002954704561101 },
        { height: 20.66481965346124, width: 7.110546185581459 },
        { height: 26.522286273766536, width: 6.08539523993726 },
        { height: 23.206089963000625, width: 2.5794931242379184 },
        { height: 20.80960997288752, width: 9.418039362614726 },
        { height: 23.144159963661888, width: 8.48468308648091 },
        { height: 25.32490005587123, width: 5.502716786154229 },
        { height: 21.773982806061756, width: 6.841652665753526 },
      ],
    });

    expect(bounces.avgDept.toFixed(2)).toBe('21.97');
  });

  it('should calculate hit points statistics', () => {
    const hits = calculateHitStatistics(testKeyMomentsData.result);
    expect(hits).toMatchObject({
      forehandHits: [
        { height: -2.5893359467472727, width: 8.624494609950858 },
        { height: -0.8750857716117193, width: 7.1579450909503235 },
        { height: -1.233540446550293, width: 3.5268123208298725 },
        { height: -2.8244708605252122, width: 2.5339838510121804 },
        { height: -1.193520431227283, width: 3.6112538274105845 },
        { height: -2.7481295392617184, width: 3.371292817377681 },
        { height: -0.2877321099682256, width: 4.270076864656284 },
        { height: -2.7658655189187864, width: 7.434172719976262 },
      ],
      backhandHits: [
        { height: -2.7067495984791106, width: 8.293104932062796 },
        { height: -2.711512967797749, width: 7.625724613280834 },
        { height: 0.17154760072055159, width: 7.195231792347413 },
        { height: -1.8477414221126789, width: 5.887629846674581 },
        { height: -2.3099671281816083, width: 5.931238600103679 },
        { height: -2.116164916280683, width: 8.612902937550619 },
        { height: -0.6029046652260577, width: 3.2885693654503947 },
        { height: -1.5506165228008597, width: 7.264004842048535 },
        { height: -0.03878172573619978, width: 6.07857891134304 },
        { height: -2.7257807457492613, width: 7.133525938316352 },
        { height: -0.15094991619724438, width: 6.7414529613135805 },
      ],
    });

    expect(hits.avgDept.toFixed(2)).toBe('-1.64');
  });

  it('should calculate rally stats', async () => {
    const rallyStats = calculateRallyShotStatistics(testKeyMomentsData.result);
    expect(rallyStats).toMatchObject({
      '1-3': {
        percentagePlayerA: 66.7,
        percentagePlayerB: 33.3,
        totalPlayerA: 4,
        totalPlayerB: 2,
      },
    });
  });
});
