'use client';

import { Button, ModalComponent } from '@ankora/ui-library';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import CreateKeyDateForm from '../CreateKeyDateForm/CreateKeyDateForm';

interface AddKeyDatesProps {
  playerId: string;
}

const AddKeyDates = ({ playerId }: AddKeyDatesProps) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();

  const handleOpenDrawer = useCallback(() => {
    setOpenDrawer(!openDrawer);
  }, [openDrawer]);

  const handleCreateKeyDateSuccess = useCallback(() => {
    handleOpenDrawer();
    router.refresh();
  }, [handleOpenDrawer, router]);

  return (
    <div className='flex justify-between items-center'>
      <p className='text-white'>Key Dates</p>
      <Button
        dataCy='Add_button'
        variant='primary'
        className='max-w-[70px]'
        onClick={handleOpenDrawer}
      >
        Add
      </Button>
      <ModalComponent
        variant='miniDrawer'
        isVisible={openDrawer}
        onClose={handleOpenDrawer}
        title='ADD KEY DATE'
      >
        <CreateKeyDateForm
          handleCreateSuccess={handleCreateKeyDateSuccess}
          playerId={playerId}
        />
      </ModalComponent>
    </div>
  );
};

export default AddKeyDates;
