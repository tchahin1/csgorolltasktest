import { Exercise, EXERCISE_TYPE } from '@ankora/models';

export interface DnDItem {
  exercise?: Exercise;
  id: string;
  type: EXERCISE_TYPE;
  duration?: string;
  reps?: string;
}
