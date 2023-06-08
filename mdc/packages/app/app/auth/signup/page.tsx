import React from 'react';
import ConnectGoogle from '../../../components/modules/ConnectGoogle/ConnectGoogle';
import RegisterForm from '../../../components/modules/RegisterForm/RegisterForm';
import SeparatorWithText from '../../../components/modules/SeparatorWithText/SeparatorWithText';

const Signup = async () => {
  return (
    <div className='flex justify-center items-center h-screen max-w-[512px] mx-auto'>
      <div className='w-full'>
        <h2 className='text-gray-900 text-3xl font-semibold mb-8 text-center break-normal'>
          Your Best Work Starts Here
        </h2>
        <ConnectGoogle withRegistration={true} />
        <SeparatorWithText text='or' />
        <RegisterForm />
      </div>
    </div>
  );
};
export default Signup;
