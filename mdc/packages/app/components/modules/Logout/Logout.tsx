'use client';

import { useAuth } from '../../../hooks/providers';

const Logout = () => {
  const { onUserLogout } = useAuth();

  return (
    <button
      onClick={() => {
        onUserLogout();
      }}
    >
      Sign out
    </button>
  );
};

export default Logout;
