'use client';
import { Coach, Player } from '@ankora/models';
import {
  Button,
  ModalComponent,
  PlayerNameCell,
  PlayerRankingCell,
  PlayerStatusCell,
  SearchInput,
} from '@ankora/ui-library';
import { IRow, Table, useDebounce } from '@ankora/ui-library/client';
import dayjs from 'dayjs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CreatePlayerForm from '../CreatePlayerForm/CreatePlayerForm';

interface PlayerTableProps {
  players: Player[];
  coaches: Coach[];
  count: number;
  currentCoach: Coach;
}

const PlayerTable = ({
  players,
  count,
  coaches,
  currentCoach,
}: PlayerTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.get('search') || '';
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleOpenDrawer = useCallback(() => {
    setOpenDrawer(!openDrawer);
  }, [openDrawer]);

  const handleCreatePlayerSuccess = useCallback(() => {
    handleOpenDrawer();
    router.refresh();
  }, [handleOpenDrawer, router]);

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

  const dataElements: IRow = useMemo(() => {
    if (!players) return {};
    const newElements: IRow = {};
    players.forEach((element) => {
      const playerName = <PlayerNameCell name={element.user.fullName} />;
      const active = <PlayerStatusCell status={!element.isInjured} />;
      const ratings = element.rank ? (
        <PlayerRankingCell
          ranking={element.rank}
          increased={element.rankStatus === 'UP'}
        />
      ) : (
        <p className='text-sm w-max md:w-full'>Unknown</p>
      );

      const playersAge = dayjs(new Date()).diff(element.dateOfBirth, 'year');
      const age = <p className='text-sm w-max md:w-full'>{playersAge}</p>;
      newElements[element.id] = { playerName, active, ratings, age };
    });
    return newElements;
  }, [players]);

  const handlePlayerClicked = (id: string) => {
    if (players.findIndex((el) => el.id === id) !== -1) {
      router.push(`players/${id}`);
    }
  };

  return (
    <div className='p-8'>
      <h2 className='text-white mb-4 text-lg'>Players</h2>
      <div className='w-full p-4 rounded-t-lg bg-gray-800 justify-between flex'>
        <SearchInput onChange={(e) => setSearchValue(e)} value={searchValue} />
        <Button
          variant='primary'
          className='max-w-[120px]'
          onClick={handleOpenDrawer}
        >
          Add player
        </Button>
      </div>
      <Table
        data={dataElements}
        columns={columns}
        totalNumberOfItems={count || 0}
        onRowClick={handlePlayerClicked}
        sort={{
          sortableColumnsKeys: columns.map((el) => el.identifier),
        }}
      />
      <ModalComponent
        variant='drawer'
        isVisible={openDrawer}
        onClose={handleOpenDrawer}
        title='ADD PLAYER'
      >
        <CreatePlayerForm
          handleCreateSuccess={handleCreatePlayerSuccess}
          coaches={coaches}
          currentCoach={currentCoach}
        />
      </ModalComponent>
    </div>
  );
};

const columns: {
  identifier: string;
  title: string;
}[] = [
  {
    identifier: 'user.name',
    title: 'My players',
  },
  {
    identifier: 'isInjured',
    title: 'Status',
  },
  {
    identifier: 'rank',
    title: 'UTR Rank',
  },
  {
    identifier: 'dateOfBirth',
    title: 'Age',
  },
];

export default PlayerTable;
