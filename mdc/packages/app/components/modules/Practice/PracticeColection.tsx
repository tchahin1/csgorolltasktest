'use client';

import { Exercise, Player, Practice } from '@ankora/models';
import {
  ModalComponent,
  PracticeCard,
  SearchInput,
  Separator,
} from '@ankora/ui-library';
import { useDebounce } from '@ankora/ui-library/client';
import humanizeDuration from 'humanize-duration';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ExerciseProvider from '../../../providers/video.provider';
import EditPracticeForm from '../EditPractice/EditPracticeForm';
import AddOrAssignPractice from './AddOrAssignPractice';
interface PracticeCollectionProps {
  practices?: Practice[];
  videos?: Exercise[];
  players?: Player[];
}

const PracticeCollection = ({
  practices,
  videos,
  players,
}: PracticeCollectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const search = searchParams?.get('practice-search') || '';
  const [searchValue, setSearchValue] = useState(search);
  const [openDrawer, setOpenDrawer] = useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const [practiceToEdit, setPracticeToEdit] = useState(null);
  const handleNewEvent = useCallback(
    (practice) => {
      setPracticeToEdit(practice);
      setOpenDrawer(!openDrawer);
    },
    [openDrawer],
  );

  useEffect(() => {
    if (!search) router.refresh();
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchValue) {
      params.set('practice-search', debouncedSearchValue);
      router.replace(`${pathname}?${params}`);
    } else if (!!search && !debouncedSearchValue) {
      params.delete('practice-search');
      router.replace(`${pathname}?${params}`);
    }
  }, [debouncedSearchValue, pathname, router, search, searchParams]);

  const handleOnAppointmentModalClose = useCallback(() => {
    setOpenDrawer(false);
    setPracticeToEdit(null);
  }, []);
  return (
    <ExerciseProvider>
      <div className='bg-gray-800 w-full p-4 rounded-lg mb-4'>
        <div className='flex justify-between w-full items-center'>
          <SearchInput
            onChange={(value) => setSearchValue(value)}
            value={searchValue}
          />
          <AddOrAssignPractice
            videos={videos}
            practices={practices}
            players={players}
          />
        </div>

        <Separator variant='dark' />
        {practices.length ? (
          <div className='flex gap-4 mt-3 flex-wrap'>
            {practices.map((practice) => {
              const {
                id,
                name,
                description,
                practiceType,
                modality,
                practiceExercise,
              } = practice;

              let duration = 0;
              practiceExercise.forEach(
                (practice) =>
                  (duration = duration + practice.duration * practice.reps),
              );

              return (
                <PracticeCard
                  dataCy={name}
                  key={id}
                  id={id}
                  title={name}
                  modality={modality}
                  description={description}
                  duration={humanizeDuration(duration * 1000, { largest: 2 })}
                  appointmentType={practiceType}
                  onClick={() => handleNewEvent(practice)}
                />
              );
            })}
          </div>
        ) : (
          <div className='h-[80px] flex justify-center items-center'>
            <h2 className='text-gray-400 italic'>Practices list is empty</h2>
          </div>
        )}
        <ModalComponent
          dataCy='Practice-modal_comp'
          isVisible={openDrawer}
          title={'Practice'}
          onClose={handleOnAppointmentModalClose}
          variant='drawer'
        >
          {openDrawer && practiceToEdit && (
            <EditPracticeForm
              initialValues={practiceToEdit}
              closeDrawer={() => setOpenDrawer(false)}
            />
          )}
        </ModalComponent>
      </div>
    </ExerciseProvider>
  );
};
export default PracticeCollection;
