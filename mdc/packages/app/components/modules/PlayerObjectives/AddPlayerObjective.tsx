'use client';

import { Button, ModalComponent } from '@ankora/ui-library';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import CreatePlayerObjectiveForm from '../CreatePlayerObjectiveForm.tsx/CreatePlayerObjectiveForm';

interface AddObjectiveDatesProps {
  playerId: string;
}

const AddPlayerObjective = ({ playerId }: AddObjectiveDatesProps) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();

  const handleOpenDrawer = useCallback(() => {
    setOpenDrawer(!openDrawer);
  }, [openDrawer]);

  const handleCreatePlayerObjectiveSuccess = useCallback(() => {
    handleOpenDrawer();
    router.refresh();
  }, [handleOpenDrawer, router]);

  return (
    <div className='flex justify-between items-center'>
      <p className='text-white'>Objectives</p>
      <Button
        dataCy='Add_button'
        variant='primary'
        className='max-w-[70px]'
        onClick={handleOpenDrawer}
      >
        Add
      </Button>
      <ModalComponent
        variant='drawer'
        isVisible={openDrawer}
        onClose={handleOpenDrawer}
        title='ADD PLAYER OBJECTIVE'
      >
        <CreatePlayerObjectiveForm
          handleCreateSuccess={handleCreatePlayerObjectiveSuccess}
          playerId={playerId}
        />
      </ModalComponent>
    </div>
  );
};

export default AddPlayerObjective;
