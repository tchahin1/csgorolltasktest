'use client';

import { appConfig } from '@ankora/config';
import { Loader } from '@ankora/ui-library';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const MobileResetPasswordRedirect = () => {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get('token'))
      window.open(`${appConfig.mobileUrl}forgot/${params.get('token')}`);
  }, [params]);

  return (
    <div className='flex justify-center items-center mx-auto h-full'>
      <Loader size='lg' />
    </div>
  );
};
export default MobileResetPasswordRedirect;
