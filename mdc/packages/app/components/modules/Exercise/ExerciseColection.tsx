'use client';

import { Exercise } from '@ankora/models';
import { ExerciseCard, useDebounce } from '@ankora/ui-library/client';
import ExerciseProvider from '../../../providers/video.provider';
import { ModalComponent, SearchInput, Separator } from '@ankora/ui-library';
import AddExercise from './AddExercise';
import AddExerciseForm from './AddExerciseForm';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
interface PracticeCollectionProps {
  exercises?: Exercise[];
}

const ExerciseCollection = ({ exercises }: PracticeCollectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const search = searchParams?.get('search') || '';
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    if (!search) router.refresh();
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchValue) {
      params.set('search', debouncedSearchValue);
      router.replace(`${pathname}?${params}`);
    } else if (!!search && !debouncedSearchValue) {
      params.delete('search');
      router.replace(`${pathname}?${params}`);
    }
  }, [debouncedSearchValue, pathname, router, search, searchParams]);

  const handleOnAppointmentModalClose = useCallback(() => {
    setOpenDrawer(false);
  }, []);
  return (
    <ExerciseProvider>
      <div className='bg-gray-800 w-full p-4 rounded-lg mb-4'>
        <div className='flex justify-between items-center'>
          <SearchInput
            onChange={(value) => setSearchValue(value)}
            value={searchValue}
          />
          <AddExercise openDrawer={() => setOpenDrawer(true)} />
        </div>

        <Separator variant='dark' />

        {exercises.length ? (
          <div className='flex gap-4 mt-3 flex-wrap translate-all'>
            {exercises.map((exercise) => {
              const { id, name, description } = exercise;
              return (
                <ExerciseCard
                  key={id}
                  id={id}
                  title={name}
                  description={description}
                  videoUrl={exercise.file?.url}
                />
              );
            })}
          </div>
        ) : (
          <div className='h-[80px] flex justify-center items-center'>
            <h2 className='text-gray-400 italic'>Exercises list is empty</h2>
          </div>
        )}
        <ModalComponent
          isVisible={openDrawer}
          title={'Exercise'}
          onClose={handleOnAppointmentModalClose}
          variant='drawer'
        >
          {openDrawer && (
            <AddExerciseForm closeDrawer={() => setOpenDrawer(false)} />
          )}
        </ModalComponent>
      </div>
    </ExerciseProvider>
  );
};
export default ExerciseCollection;
