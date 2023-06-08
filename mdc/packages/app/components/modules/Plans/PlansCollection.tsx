'use client';

import {
  Button,
  ModalComponent,
  SearchInput,
  Separator,
} from '@ankora/ui-library';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import CreatePlanForm from '../CreatePlanForm/CreatePlanForm';

import { useDebounce } from '@ankora/ui-library/client';
import { useRouter } from 'next/navigation';
import EmptyPlansCollection from './EmptyPlansCollection';
import PlansList from './PlansList';
import AssignPlanForm from '../AssignPlanForm/AssignPlanForm';
import { Plan, Practice } from '@ankora/models';
import { useAuth } from '../../../hooks/providers';

interface PlansCollectionProps {
  plans?: Plan[];
  practices?: Practice[];
  flag: boolean;
}

const PlansCollection = ({ plans, practices, flag }: PlansCollectionProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const search = searchParams?.get('search') || '';
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [modalVariant, setModalVariant] = useState(null);

  const handleModalVariant = useCallback((variant: string) => {
    setModalVariant(variant);
  }, []);

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

  const handleModalSuccess = useCallback(() => {
    handleModalVariant(null);
    router.refresh();
  }, [handleModalVariant, router]);

  return (
    <div className='w-full min-h-full bg-gray-900 p-8'>
      <h2 className='text-white mb-4 text-lg'>Plans</h2>
      {flag ? (
        <div className='bg-gray-800 w-full p-4 rounded-lg mb-4'>
          <div className='flex justify-between items-center'>
            {flag && (
              <SearchInput
                onChange={(value) => setSearchValue(value)}
                value={searchValue}
              />
            )}
            <div className='flex gap-2'>
              <Button
                variant='ghost'
                className='!w-[130px] text-white'
                onClick={() => handleModalVariant('assign')}
              >
                Assign a plan
              </Button>
              <Button
                variant='primary'
                className='!w-[130px] hidden lg:block'
                onClick={() => handleModalVariant('add')}
              >
                Add a plan
              </Button>
            </div>
          </div>
          <Separator variant='dark' />
          <PlansList plans={plans} />
        </div>
      ) : (
        <EmptyPlansCollection onClick={() => handleModalVariant('add')} />
      )}
      {!!modalVariant && (
        <ModalComponent
          title={modalVariant === 'assign' ? 'Assign a plan' : 'MY PLAN'}
          variant={modalVariant === 'assign' ? 'drawer' : 'huge'}
          isVisible={!!modalVariant}
          onClose={() => handleModalVariant(null)}
        >
          {modalVariant === 'assign' ? (
            <AssignPlanForm
              handleCreateSuccess={handleModalSuccess}
              plans={plans}
              role={user.role}
            />
          ) : (
            <CreatePlanForm
              handleCreateSuccess={handleModalSuccess}
              allPractices={practices}
            />
          )}
        </ModalComponent>
      )}
    </div>
  );
};
export default PlansCollection;
