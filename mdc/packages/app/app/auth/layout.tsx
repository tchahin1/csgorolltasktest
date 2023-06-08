import React from 'react';
import coachingLogo from '../../assets/coaching_logo.png';
import Image from 'next/image';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col lg:flex-row w-full'>
      <div className='w-full px-4 t:w-1/2'>{children}</div>
      <div className='hidden lg:block w-full t:w-1/2 bg-login bg-cover bg-center h-screen py-10 px-20'>
        <div className='flex w-full mb-6'>
          <Image
            src={coachingLogo}
            alt='coaching_logo'
            width={32}
            height={32}
          />
          <h2 className='text-white ml-2 text-2xl font-semibold'>
            Coaching portal
          </h2>
        </div>
        <h1 className='text-white font-extrabold text-4xl leading-9 max-w-[450px] mb-3'>
          Practice like the pros.
        </h1>
        <p className='text-white max-w-[530px] text-gray-200 break-normal'>
          Level up your game with personalized plans. Access world class
          coaches, from your phone.
        </p>
      </div>
    </div>
  );
}
