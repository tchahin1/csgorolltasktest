'use client';

import { Practice } from '@ankora/models';
import {
  Button,
  ChecklistInfoCell,
  ModalComponent,
  QuestionsInfoCell,
} from '@ankora/ui-library';
import { VideoInfoCell } from '@ankora/ui-library/client';
import { MODALITY } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { BuildPractice } from '../BuildPractice/BuildPractice';
import { DeletePractice } from './DeletePractice';

interface EditPracticeFormProps {
  initialValues: Practice;
  closeDrawer: () => void;
  dataCy?: string;
}

const EditPracticeForm = ({
  initialValues,
  closeDrawer,
}: EditPracticeFormProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBuildPracticeModal, setShowBuildPracticeModal] = useState(false);
  const router = useRouter();

  const checklistValues = useMemo(() => {
    if (initialValues.modality === MODALITY.TODO) {
      return {
        title: initialValues.questions[0]['title'],
        options: initialValues.questions[0]['options'],
      };
    }
    return null;
  }, [initialValues.modality, initialValues.questions]);

  const questionaryValues = useMemo(() => {
    if (initialValues.modality === MODALITY.QUESTION) {
      return initialValues.questions[0]['options'];
    }
    return null;
  }, [initialValues.modality, initialValues.questions]);

  const videoValues = useMemo(() => {
    if (initialValues.modality === MODALITY.VIDEO) {
      return initialValues.practiceExercise;
    }
    return null;
  }, [initialValues.modality, initialValues.practiceExercise]);

  const handleEditPracticeSuccess = useCallback(() => {
    setShowBuildPracticeModal(false);
    closeDrawer();
    router.refresh();
  }, [closeDrawer, router]);

  return (
    <>
      <div className='p-4 h-full flex flex-col'>
        <p className='text-xl font-semibold text-white mt-1'>
          {initialValues.name}
        </p>
        <p className='text-base font-normal text-white'>
          {initialValues.description}
        </p>
        {initialValues.modality === MODALITY.VIDEO && (
          <VideoInfoCell videos={videoValues} />
        )}
        {initialValues.modality === MODALITY.QUESTION &&
          !!questionaryValues && (
            <QuestionsInfoCell options={questionaryValues} />
          )}
        {initialValues.modality === MODALITY.TODO && !!checklistValues && (
          <ChecklistInfoCell
            title={checklistValues.title}
            options={checklistValues.options}
          />
        )}
        <div className='mt-auto flex flex-row gap-4'>
          <Button
            className='mb-2'
            dataCy='Delete_practice-button'
            type='submit'
            variant='ghostDelete'
            onClick={() => setShowDeleteModal(true)}
          >
            <p>Delete practice</p>
          </Button>

          <Button
            className='mb-2'
            dataCy='Edit-button'
            type='submit'
            onClick={() => setShowBuildPracticeModal(true)}
          >
            <p>Edit</p>
          </Button>
        </div>
      </div>
      {showDeleteModal && (
        <ModalComponent
          dataCy='Delete-modal'
          onClose={() => setShowDeleteModal(false)}
          isVisible={showDeleteModal}
          variant='sm'
          classNames={{ wrapper: 'bg-gray-800' }}
        >
          <DeletePractice
            id={initialValues.id}
            onClose={() => setShowDeleteModal(false)}
            closeDrawer={closeDrawer}
          />
        </ModalComponent>
      )}

      {showBuildPracticeModal && (
        <BuildPractice
          initialValues={initialValues}
          handleCreateSuccess={handleEditPracticeSuccess}
          handleClose={() => setShowBuildPracticeModal(false)}
        />
      )}
    </>
  );
};

export default EditPracticeForm;
