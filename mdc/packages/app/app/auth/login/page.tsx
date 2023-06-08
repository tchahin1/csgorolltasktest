import React from 'react';
import ConnectGoogle from '../../../components/modules/ConnectGoogle/ConnectGoogle';
import LoginForm from '../../../components/modules/LoginForm/LoginForm';
import SeparatorWithText from '../../../components/modules/SeparatorWithText/SeparatorWithText';
const Login = async () => {
  return (
    <div className='flex justify-center items-center h-screen max-w-[512px] mx-auto'>
      <div className='w-full'>
        <h3 className='text-gray-900 text-xl font-semibold mb-8'>
          Welcome back
        </h3>
        <ConnectGoogle withRegistration={false} />
        <SeparatorWithText text='or' />
        <LoginForm />
      </div>
    </div>
  );
};
export default Login;
