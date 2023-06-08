import { KincubeResultHit, PLAYER_SIDE_LONG } from '../dto/kincube-result.dto';

export const isPlayerA = (hit: KincubeResultHit) => {
  return hit.hitter === PLAYER_SIDE_LONG.DOWN;
};

export const isPlayerB = (hit: KincubeResultHit) => {
  return hit.hitter === PLAYER_SIDE_LONG.UP;
};

export const getDistance = (a: [number, number], b: [number, number]) => {
  return Math.hypot(b[1] - a[1], b[0] - a[0]);
};
