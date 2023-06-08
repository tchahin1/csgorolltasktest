import React, { useEffect, useState } from 'react';
import { SearchInput, VideoPlayerVariants } from '@ankora/ui-library';
import { Draggable } from '@hello-pangea/dnd';
import { VideoPlayer } from '@ankora/ui-library/client';
import { useExercises } from '../../../hooks/providers';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@ankora/ui-library/client';

const VideoExercisesCollection = React.forwardRef<HTMLDivElement, unknown>(
  (_: unknown, ref) => {
    const { exercises } = useExercises();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const search = searchParams?.get('search') || '';
    const [searchValue, setSearchValue] = useState(search);
    const debouncedSearchValue = useDebounce(searchValue, 500);
    useEffect(() => {
      const params = new URLSearchParams(searchParams);
      if (debouncedSearchValue) {
        params.set('search', debouncedSearchValue);
        router.replace(`${pathname}?${params}`);
      } else if (!!search && !debouncedSearchValue) {
        params.delete('search');
        router.replace(`${pathname}?${params}`);
      }
    }, [debouncedSearchValue, pathname, router, search, searchParams]);

    return (
      <>
        <SearchInput
          value={searchValue}
          placeholder='Search for an exercise'
          onChange={(value) => setSearchValue(value)}
        />
        <div
          className='grid-cols-1 gap-2 lg:gap-3 grid lg:grid-cols-3 mt-4'
          ref={ref}
        >
          {exercises?.map((el, index) => (
            <Draggable key={el.id} draggableId={el.id} index={index}>
              {(draggableProvided) => (
                <div
                  {...draggableProvided.dragHandleProps}
                  {...draggableProvided.draggableProps}
                  ref={draggableProvided.innerRef}
                >
                  <VideoPlayer
                    key={el.id}
                    description={el.description}
                    url={el.file.url}
                    variant={VideoPlayerVariants.Large}
                  />
                </div>
              )}
            </Draggable>
          ))}
        </div>
      </>
    );
  },
);

export default VideoExercisesCollection;
