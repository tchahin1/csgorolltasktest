import React from 'react';

import ResetPasswordForm from '../../../components/modules/ResetPasswordForm/ResetPasswordForm';

const ResetPassword = async () => {
  return (
    <div className='flex justify-center items-center h-screen max-w-[512px] mx-auto'>
      <div className='w-full'>
        <h3 className='text-gray-900 text-xl font-semibold'>
          Reset your Password
        </h3>
        <p className='text-gray-500 text-base mb-6'>
          Please enter your new password
        </p>
        <ResetPasswordForm />
      </div>
    </div>
  );
};
export default ResetPassword;
