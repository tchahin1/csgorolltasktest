'use client';

import { Tournament } from '@ankora/models';
import { TextCell, SearchInput, Separator } from '@ankora/ui-library';
import { IRow, Table, useDebounce } from '@ankora/ui-library/client';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { tournamentColumns } from '../../../constants/playerTournaments';

interface PlayerTournamentsProps {
  tournaments: Tournament[];
  count: number;
}

const PlayerTournaments = ({ tournaments, count }: PlayerTournamentsProps) => {
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

  const playerTournaments: IRow = useMemo(() => {
    if (!tournaments) return {};
    const newTournamentsElements: IRow = {};
    tournaments?.forEach((tournament) => {
      const tournamentName = (
        <TextCell
          text={tournament.name}
          className='!text-white whitespace-pre-line font-medium leading-5'
        />
      );

      const opponent = <TextCell text={tournament.oponent} />;
      const winLoseRatio = <TextCell text={tournament.status} />;
      const score = <TextCell text={tournament.result} />;

      newTournamentsElements[tournament.id] = {
        tournamentName,
        opponent,
        winLoseRatio,
        score,
      };
    });
    return newTournamentsElements;
  }, [tournaments]);

  return (
    <div className='bg-gray-800 w-full p-4 rounded-lg mb-4'>
      <p className='text-white'>Tournament Results</p>
      <Separator variant='dark' />
      {(tournaments.length || searchValue) && (
        <SearchInput
          onChange={(value) => setSearchValue(value)}
          value={searchValue}
        />
      )}
      {tournaments?.length ? (
        <div className='mt-4'>
          <Table
            data={playerTournaments}
            columns={tournamentColumns}
            totalNumberOfItems={count}
          />
        </div>
      ) : (
        <div className='h-[80px] flex justify-center items-center'>
          <h2 className='text-gray-400 italic'>
            Tournament results list is empty
          </h2>
        </div>
      )}
    </div>
  );
};

export default PlayerTournaments;
