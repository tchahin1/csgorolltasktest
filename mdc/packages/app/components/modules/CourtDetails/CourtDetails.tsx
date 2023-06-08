'use client';

import { Appointment } from '@ankora/models';
import { DrawerScheduleCard, Separator, Loader } from '@ankora/ui-library';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { apiClient } from '../../../lib/apiClient';

interface CourtDetailsProps {
  id: string;
}

const CourtDetails = ({ id }: CourtDetailsProps) => {
  const { data: court, refetch } = useQuery(
    ['court'],
    () => apiClient.court.getById({ id }),
    {
      enabled: !!id,
    },
  );

  useEffect(() => {
    if (id) refetch();
  }, [id, refetch]);

  if (!court?.data) return <Loader />;

  return (
    <div className='p-4'>
      <p className='text-white'>Court</p>
      <p className='text-primary-500'>{court.data.name}</p>
      <Separator variant='dark' />
      <p className='text-white mb-3'>Bookings</p>
      {court.data.appointments?.length ? (
        court.data.appointments?.map((appointment) => (
          <div key={appointment.id} className='mb-8'>
            <DrawerScheduleCard
              appointment={appointment as unknown as Appointment}
              hideCourt
            />
          </div>
        ))
      ) : (
        <div className='h-[80px] flex justify-center items-center'>
          <h2 className='text-gray-400 italic'>Bookings list is empty</h2>
        </div>
      )}
    </div>
  );
};
export default CourtDetails;
