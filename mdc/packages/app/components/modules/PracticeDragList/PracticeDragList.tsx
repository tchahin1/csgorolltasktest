import { Practice } from '@ankora/models';
import {
  checklist,
  questions,
  SearchInput,
  Separator,
  video,
} from '@ankora/ui-library';
import { useDebounce } from '@ankora/ui-library/client';
import { Draggable } from '@hello-pangea/dnd';
import { MODALITY } from '@prisma/client';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface PracticeDragListProps {
  modality?: MODALITY;
  practices: Practice[];
}

const PracticeDragList = React.forwardRef<
  HTMLDivElement,
  PracticeDragListProps
>(({ modality, practices }: PracticeDragListProps, ref) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.get('search-practice') || '';
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchValue) {
      params.set('search-practice', debouncedSearchValue);
      router.replace(`${pathname}?${params}`);
    } else if (!!search && !debouncedSearchValue) {
      params.delete('search-practice');
      router.replace(`${pathname}?${params}`);
    }
  }, [debouncedSearchValue, pathname, router, search, searchParams]);

  const renderModalityPracticeImage = () => {
    switch (modality) {
      case MODALITY.VIDEO:
        return video;
      case MODALITY.QUESTION:
        return questions;
      case MODALITY.TODO:
        return checklist;
    }
  };

  return (
    <>
      <SearchInput
        value={searchValue}
        placeholder='Search for an practice'
        onChange={(value) => setSearchValue(value)}
      />
      <div className='mt-4' ref={ref}>
        {practices?.map((practice, index) => (
          <>
            <Draggable
              key={practice.id}
              draggableId={practice.id}
              index={index}
            >
              {(draggableProvided) => (
                <div
                  {...draggableProvided.dragHandleProps}
                  {...draggableProvided.draggableProps}
                  ref={draggableProvided.innerRef}
                >
                  <div className='flex w-full items-center gap-3 py-3'>
                    <div className='w-[94px] h-[69px] bg-gray-800 rounded-lg flex justify-center items-center'>
                      <Image
                        data-cy={practice.name}
                        src={renderModalityPracticeImage()}
                        alt={practice.name}
                        width={24}
                        height={24}
                      />
                    </div>
                    <p className='text-white text-sm'>{practice.name}</p>
                  </div>
                </div>
              )}
            </Draggable>
            <Separator variant='dark' className='m-0' />
          </>
        ))}
      </div>
    </>
  );
});

export default PracticeDragList;
