'use client';

import { Exercise, Player, Practice } from '@ankora/models';
import { Button, ModalComponent } from '@ankora/ui-library';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useExercises } from '../../../hooks/providers';
import AssignPracticeForm from '../AssignPractice/AssignPracticeForm';
import CreatePracticeForm from '../CreatePractice/CreatePracticeForm';

interface AddPracticeProps {
  videos?: Exercise[];
  practices?: Practice[];
  players?: Player[];
}

const AddOrAssignPractice = ({
  videos,
  practices,
  players,
}: AddPracticeProps) => {
  const [drawerContent, setDrawerContent] = useState<'add' | 'assign'>(null);
  const router = useRouter();
  const { setExercises } = useExercises();

  const handleDrawerContent = useCallback((content: 'add' | 'assign') => {
    setDrawerContent(content);
  }, []);

  const handleCreatePracticeSuccess = useCallback(() => {
    handleDrawerContent(null);
    router.refresh();
  }, [handleDrawerContent, router]);

  useEffect(() => setExercises(videos), [setExercises, videos]);

  const renderDrawerContent = () => {
    switch (drawerContent) {
      case 'add':
        return (
          <CreatePracticeForm
            handleCreateSuccess={handleCreatePracticeSuccess}
          />
        );
      case 'assign':
        return (
          <AssignPracticeForm
            practices={practices}
            players={players}
            handleCreateSuccess={handleCreatePracticeSuccess}
          />
        );
      default:
        return null;
    }
  };

  const renderTitle = () => {
    switch (drawerContent) {
      case 'add':
        return 'Add practice';
      case 'assign':
        return 'Assign practice';
      default:
        return null;
    }
  };

  return (
    <div>
      <div className='flex gap-4'>
        <Button
          dataCy='Assign_practice-button'
          variant='ghost'
          className='text-white !w-[150px]'
          onClick={() => handleDrawerContent('assign')}
        >
          Assign practice
        </Button>
        <Button
          dataCy='Add_button'
          variant='primary'
          className='max-w-[70px] hidden lg:block'
          onClick={() => handleDrawerContent('add')}
        >
          Add
        </Button>
      </div>
      <ModalComponent
        variant='drawer'
        isVisible={!!drawerContent}
        onClose={() => handleDrawerContent(null)}
        title={renderTitle()}
      >
        {renderDrawerContent()}
      </ModalComponent>
    </div>
  );
};

export default AddOrAssignPractice;
