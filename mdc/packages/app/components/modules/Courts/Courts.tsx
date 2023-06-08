'use client';

import { Court } from '@ankora/models';
import {
  TextCell,
  SearchInput,
  CourtStatus,
  ModalComponent,
} from '@ankora/ui-library';
import {
  AppointmentCell,
  IRow,
  Table,
  useDebounce,
} from '@ankora/ui-library/client';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { courtColumns } from '../../../constants/courtColumns';
import CourtDetails from '../CourtDetails/CourtDetails';

interface CourtsProps {
  courts: Court[];
  count: number;
}

const Courts = ({ courts, count }: CourtsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.get('search') || '';
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const [selectedCourt, setSelectedCourt] = useState<string>(null);

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

  const allCourts: IRow = useMemo(() => {
    if (!courts) return {};
    const newCourtsElements: IRow = {};
    courts?.forEach((court) => {
      const courtName = (
        <TextCell
          text={court.name}
          className='!text-white whitespace-pre-line font-medium leading-5'
        />
      );

      const booked = <AppointmentCell appointments={court.appointments} />;
      const status = <CourtStatus status={court.isActive} />;

      newCourtsElements[court.id] = {
        courtName,
        booked,
        status,
      };
    });
    return newCourtsElements;
  }, [courts]);

  return (
    <div className='w-full p-8'>
      <h2 className='text-white mb-4 text-lg'>Courts</h2>
      <div className='bg-gray-800 w-full rounded-lg'>
        {(courts.length || searchValue) && (
          <div className='w-full p-4'>
            <SearchInput
              onChange={(value) => setSearchValue(value)}
              value={searchValue}
            />
          </div>
        )}
        {courts?.length ? (
          <div className='mt-1'>
            <Table
              data={allCourts}
              columns={courtColumns}
              totalNumberOfItems={count}
              sort={{
                sortableColumnsKeys: ['status'],
              }}
              onRowClick={(row) => setSelectedCourt(row)}
            />
          </div>
        ) : (
          <div className='h-[80px] flex justify-center items-center'>
            <h2 className='text-gray-400 italic'>Court list is empty</h2>
          </div>
        )}
      </div>
      {selectedCourt && (
        <ModalComponent
          title='COURT OVERVIEW'
          onClose={() => setSelectedCourt(null)}
          isVisible={!!selectedCourt}
          variant={'drawer'}
        >
          <CourtDetails id={selectedCourt} />
        </ModalComponent>
      )}
    </div>
  );
};

export default Courts;
