import React from 'react';

import ForgotPasswordForm from '../../../components/modules/ForgotPasswordForm/ForgotPasswordForm';

const ForgotPassword = async () => {
  return (
    <div className='flex justify-center items-center h-screen max-w-[512px] mx-auto'>
      <div className='w-full'>
        <h3 className='text-gray-900 text-xl font-semibold'>
          Reset your Password
        </h3>
        <p className='text-gray-500 text-base mb-12'>
          We&apos;ll email you instructions to reset your password.{' '}
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};
export default ForgotPassword;
