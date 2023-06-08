'use client';

import { Button } from '@ankora/ui-library';

interface AddExerciseProps {
  openDrawer: () => void;
}

const AddExercise = ({ openDrawer }: AddExerciseProps) => {
  return (
    <Button
      dataCy='Add_button'
      variant='primary'
      className='max-w-[70px] hidden lg:block'
      onClick={openDrawer}
    >
      Add
    </Button>
  );
};

export default AddExercise;
