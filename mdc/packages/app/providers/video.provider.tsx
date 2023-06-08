import { Exercise } from '@ankora/models';
import { createContext, PropsWithChildren, useState } from 'react';

type ExerciseContextInterface = {
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
};

export const ExercisesContext = createContext<ExerciseContextInterface>({
  exercises: [],
  setExercises() {
    return;
  },
});

const useExercises = () => {
  const [exercises, setExercises] = useState(null);

  return {
    exercises,
    setExercises,
  };
};

const ExerciseProvider = ({
  children,
}: PropsWithChildren<Record<string, unknown>>) => {
  const data = useExercises();
  return (
    <ExercisesContext.Provider value={data}>
      {children}
    </ExercisesContext.Provider>
  );
};

export default ExerciseProvider;
