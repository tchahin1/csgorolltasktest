'use client';

import { Button, ModalComponent } from '@ankora/ui-library';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import CreateAssessmentForm from '../CreateAssessmentForm/CreateAssessmentForm';

interface AddMatchAssessmentsProps {
  playerId: string;
}

const AddMatchAssessment = ({ playerId }: AddMatchAssessmentsProps) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();

  const handleOpenDrawer = useCallback(() => {
    setOpenDrawer(!openDrawer);
  }, [openDrawer]);

  const handleCreateAssessmentSuccess = useCallback(() => {
    handleOpenDrawer();
    router.refresh();
  }, [handleOpenDrawer, router]);

  return (
    <div className='flex justify-between items-center'>
      <p className='text-white'>Match assessment</p>
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
        title='ASSESSMENT'
      >
        <CreateAssessmentForm
          handleCreateSuccess={handleCreateAssessmentSuccess}
          playerId={playerId}
        />
      </ModalComponent>
    </div>
  );
};

export default AddMatchAssessment;
