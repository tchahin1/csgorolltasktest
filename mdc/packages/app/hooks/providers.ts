import { useContext } from 'react';
import { UserContext } from '../providers/auth.provider';
import { ExercisesContext } from '../providers/video.provider';

export const useAuth = () => useContext(UserContext);
export const useExercises = () => useContext(ExercisesContext);
