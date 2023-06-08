'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/providers';
import TOKEN from '../../lib/token';
import Header from '../modules/Header/Header';

interface ProtectedRoutesWrapper {
  children?: React.ReactNode;
}

const publicRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/mobile-reset-password',
];

export const ProtectedRoutesWrapper = ({
  children,
}: ProtectedRoutesWrapper) => {
  const { isUserAuthenticated, isUserFetched } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isRoutePublic = useMemo(
    () => publicRoutes.includes(pathname),
    [pathname],
  );

  useEffect(() => {
    if (
      (!TOKEN.get() || (!isUserAuthenticated && isUserFetched)) &&
      !isRoutePublic
    )
      router.push('/auth/login');
  }, [isRoutePublic, isUserAuthenticated, isUserFetched, router]);

  if (isUserAuthenticated)
    return (
      <>
        {!isRoutePublic && <Header />}
        <div className='pt-16 md:pt-[125px]'>{children}</div>
      </>
    );
  if (isRoutePublic) return children;
  return null;
};

export default ProtectedRoutesWrapper;
