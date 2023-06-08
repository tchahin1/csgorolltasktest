'use client';

import { Assessment, Player } from '@ankora/models';
import {
  AssessmentCard,
  ModalComponent,
  SearchInput,
} from '@ankora/ui-library';
import { useDebounce } from '@ankora/ui-library/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import AssessmentQuestionary from '../AssessmentQuestionary/AssessmentQuestionary';
import AddMatchAssessment from './AddMatchAssessment';

interface MatchAssessmentsProps {
  assessments?: Assessment[];
  player: Player;
}

export const MatchAssessments = ({
  assessments = [],
  player,
}: MatchAssessmentsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.get('assessment-search') || '';
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchValue) {
      params.set('assessment-search', debouncedSearchValue);
      router.replace(`${pathname}?${params}`);
    } else if (!!search && !debouncedSearchValue) {
      params.delete('assessment-search');
      router.replace(`${pathname}?${params}`);
    }
  }, [debouncedSearchValue, pathname, router, search, searchParams]);

  const [openAssessmentDrawer, setOpenAssessmentDrawer] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState('');

  const handleOpenAssessmentDrawer = useCallback(() => {
    setOpenAssessmentDrawer(!openAssessmentDrawer);
    setSelectedAssessment(null);
  }, [openAssessmentDrawer]);

  const handleCardClick = (id: string) => {
    handleOpenAssessmentDrawer();
    setSelectedAssessment(id);
  };

  return (
    <div className='bg-gray-800 w-full p-4 rounded-lg mb-4'>
      <AddMatchAssessment playerId={player.id} />
      <SearchInput
        onChange={(value) => setSearchValue(value)}
        value={searchValue}
      />
      {assessments.length ? (
        <div className='flex gap-4 mt-3 flex-wrap'>
          {assessments.map((assessment) => {
            const { id, title, createdAt, status, description } = assessment;
            return (
              <AssessmentCard
                id={id}
                key={title}
                title={title}
                date={createdAt}
                status={status}
                description={description}
                onClick={() => handleCardClick(id)}
              />
            );
          })}
        </div>
      ) : (
        <div className='h-[80px] flex justify-center items-center'>
          <h2 className='text-gray-400 italic'>Assessment list is empty</h2>
        </div>
      )}
      {selectedAssessment && (
        <ModalComponent
          variant='drawer'
          isVisible={openAssessmentDrawer}
          onClose={handleOpenAssessmentDrawer}
          title='ASSESSMENT'
        >
          <AssessmentQuestionary
            id={selectedAssessment}
            player={player}
            closeDrawer={handleOpenAssessmentDrawer}
          />
        </ModalComponent>
      )}
    </div>
  );
};
