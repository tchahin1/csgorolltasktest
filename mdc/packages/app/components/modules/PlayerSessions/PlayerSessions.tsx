'use client';

import { ApiError } from '@ankora/api-client';
import { appToggles } from '@ankora/config';
import { Session } from '@ankora/models';
import { ModalComponent, SearchInput } from '@ankora/ui-library';
import { SessionCard, useDebounce } from '@ankora/ui-library/client';
import { VIDEO_STATUS } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import humanizeDuration from 'humanize-duration';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiClient } from '../../../lib/apiClient';
import SessionStats from '../SessionStats/SessionStats';
import UploadSession from './UploadSession';

interface PlayerSessionsProps {
  sessions: Session[];
  playerId: string;
}

export const PlayerSessions = ({
  sessions = [],
  playerId = '',
}: PlayerSessionsProps) => {
  const [selectedSession, setSelectedSession] = useState<Session>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.get('session-search') || '';
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearchValue) {
      params.set('session-search', debouncedSearchValue);
      router.replace(`${pathname}?${params}`);
    } else if (!!search && !debouncedSearchValue) {
      params.delete('session-search');
      router.replace(`${pathname}?${params}`);
    }
  }, [debouncedSearchValue, pathname, router, search, searchParams]);

  const sendVideoToKincube = useMutation(
    (data: { id: string }) => {
      return apiClient.session.findKeyMoments({ id: data.id });
    },
    {
      onSuccess() {
        toast.success('Video is being processed');
        router.refresh();
      },
      onError(e: ApiError) {
        toast.error(`Video couldn't be processed`);
      },
    },
  );
  const handleFindKeyMomentsClick = (id: string) => {
    sendVideoToKincube.mutate({ id });
  };

  return (
    <div className='bg-gray-800 w-full p-4 rounded-lg mb-4'>
      <UploadSession playerId={playerId} />
      <SearchInput
        onChange={(value) => setSearchValue(value)}
        value={searchValue}
      />
      {sessions.length ? (
        <div className='flex gap-4 mt-6 flex-wrap'>
          {sessions.map((session) => {
            const { name, player, opponent, id, videoStatus, createdAt, file } =
              session;

            return (
              <SessionCard
                key={name}
                title={name}
                player={player}
                opponent={opponent}
                onKeyMomentsClick={handleFindKeyMomentsClick}
                onCardClick={() => {
                  if (session.videoStatus === VIDEO_STATUS.COMPLETED)
                    setSelectedSession(session);
                }}
                id={id}
                videoStatus={videoStatus}
                createdAt={dayjs(createdAt).format('MMM D, YYYY')}
                duration={humanizeDuration(
                  Math.trunc(session.file.duration) * 1000,
                  {
                    largest: 1,
                  },
                )}
                videoUrl={file.url}
              />
            );
          })}
        </div>
      ) : (
        <div className='h-[80px] flex justify-center items-center'>
          <h2 className='text-gray-400 italic'>Sessions list is empty</h2>
        </div>
      )}

      {!!selectedSession && (
        <ModalComponent
          title={selectedSession.name}
          onClose={() => setSelectedSession(null)}
          isVisible={!!selectedSession}
          variant='huge'
          classNames={{ wrapper: 'bg-gray-900 overflow-auto' }}
        >
          <SessionStats session={selectedSession} />
        </ModalComponent>
      )}
    </div>
  );
};
