'use client';

import NavBar from '../NavBar/NavBar';
import Image from 'next/image';
import { Avatar, logout, Separator } from '@ankora/ui-library';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import coachingLogo from '../../../assets/coaching_logo.png';
import hamburgerIcon from '../../../assets/hamburger.svg';
import { getInitials } from '../../../helpers/utils';
import { useAuth } from '../../../hooks/providers';
import MDCSidebar from '../MDCSidebar/MDCSidebar';
import { ROLE } from '@prisma/client';

const Header = () => {
  const { user, onUserLogout } = useAuth();
  const isSuperCoach = user.role === ROLE.SUPER_COACH;
  const pathname = usePathname();

  const [showSideBar, setShowSidebar] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  useEffect(() => {
    setShowSidebar(false);
  }, [pathname, setShowSidebar]);

  return (
    <div className='bg-gray-700 w-screen fixed z-10'>
      <div className='px-8 py-4 grid grid-cols-6 gap-4'>
        <div className='flex flex-row items-center col-start-1 col-end-3'>
          <Image
            src={coachingLogo}
            alt={'logo'}
            className={'h-[28px] w-[28px]'}
          />
          <h3
            className='text-white hidden md:flex text-[20px] ml-4'
            data-cy='Coaching-portal_title'
          >
            Coaching portal
          </h3>
          <button
            className='md:hidden'
            onClick={() => setShowSidebar(!showSideBar)}
          >
            <Image
              src={hamburgerIcon}
              alt={'Menu'}
              className={'h-[28px] w-[28px] ml-2'}
            />
          </button>
        </div>

        <div className='flex flex-row gap-4 items-center justify-end col-end-7 col-span-2'>
          <Avatar
            className='h-[32px] w-[32px]'
            initials={getInitials(user.fullName)}
            url={user.profileImage || ''}
            id='avatar'
            onClick={() => setOpenTooltip(!openTooltip)}
          />
          <UncontrolledTooltip
            target='avatar'
            placement='bottom'
            autohide={false}
            trigger='click'
            hideArrow={false}
          >
            <div
              onClick={onUserLogout}
              className='flex cursor-pointer px-2 py-1 rounded-xl bg-gray-800 !opacity-100 z-10 mt-2'
            >
              <Image src={logout} alt='logout' className='mr-4' />
              <p className='text-white'>Logout</p>
            </div>
          </UncontrolledTooltip>
        </div>
      </div>
      <Separator variant='dark' className='my-0'></Separator>
      <NavBar isSuperCoach={isSuperCoach} />
      {showSideBar && <MDCSidebar />}
    </div>
  );
};

export default Header;
