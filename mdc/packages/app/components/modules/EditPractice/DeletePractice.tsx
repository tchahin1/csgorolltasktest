'use client';
import { Button, warningIcon } from '@ankora/ui-library';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import { toast } from 'react-toastify';
import { useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
interface DeletePracticeModalProps {
  id: string;
  onClose: () => void;
  closeDrawer: () => void;
}

export const DeletePractice = ({
  id,
  onClose,
  closeDrawer,
}: DeletePracticeModalProps) => {
  const router = useRouter();
  const deletePractice = useMutation(() => apiClient.practice.delete({ id }), {
    onSuccess: () => {
      toast.success('Practice deleted successfully');
      router.refresh();
      onClose();
      closeDrawer();
    },
    onError: () => toast.error('Something went wrong while deleting practice'),
  });

  const handleDeletePractice = useCallback(() => {
    deletePractice.mutate();
  }, [deletePractice]);

  return (
    <>
      <div className='p-4 pt-0 flex flex-col justify-center items-center text-center w-full'>
        <Image src={warningIcon} alt='Warning' />
        <p className='mt-4 text-primary-600 text-base leading-relaxed font-medium'>
          Delete this practice?
        </p>
        <p className='mt-3 text-gray-400 text-base leading-relaxed font-normal'>
          Are you sure you want to delete this practice?
        </p>
        <div className='flex items-center justify-center mt-4 rounded-b gap-4'>
          <Button
            className='mb-2 !w-24 h-10 !px-3'
            dataCy='modal_cancel_button'
            type='submit'
            variant='ghostCancel'
            onClick={onClose}
          >
            {<p>Cancel</p>}
          </Button>
          <Button
            className='mb-2 !w-24 h-10 !px-3'
            dataCy='modal_delete_button'
            type='submit'
            variant='ghostDeleteRevert'
            onClick={handleDeletePractice}
          >
            <p>Delete</p>
          </Button>
        </div>
      </div>
    </>
  );
};
