'use client';

import { Sidebar } from '@ankora/ui-library';
import { usePathname } from 'next/navigation';
import { sidebarItems } from '../../../constants/sidebarRoutes';
import logo from '../../../assets/mdc-logo.svg';
import { useAuth } from '../../../hooks/providers';

const MDCSidebar = () => {
  const pathname = usePathname();
  const { onUserLogout } = useAuth();
  return (
    <Sidebar
      activePath={pathname}
      sidebarItems={sidebarItems}
      logo={logo}
      onLogout={onUserLogout}
    />
  );
};

export default MDCSidebar;
