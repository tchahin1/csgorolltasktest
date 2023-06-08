import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import TOKEN from '../lib/token';
import { apiClient } from '../lib/apiClient';
import { User } from '@ankora/api-client';
import { firebaseLogout } from '@ankora/firebase';

type UserContextInterface = {
  user?: User;
  userLoading?: boolean;
  isUserAuthenticated: boolean;
  onUserLoginSuccess: (token: string) => void;
  refetchUser?: () => void;
  isUserFetched: boolean;
  onUserLogout: () => void;
};

export const UserContext = createContext<UserContextInterface>({
  user: undefined,
  isUserAuthenticated: false,
  onUserLoginSuccess() {
    return;
  },
  isUserFetched: false,
  onUserLogout() {
    return;
  },
});

const useAuthProviderData = () => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const queryClient = new QueryClient();

  const onUserLoginSuccess = async (token: string) => {
    TOKEN.set(token);
    setToken(token);
  };

  const onUserLogout = async () => {
    TOKEN.remove();
    setToken(undefined);
    await firebaseLogout();
    queryClient.invalidateQueries({ queryKey: ['me'] });
  };

  const checkToken = useCallback(async () => {
    const token = TOKEN.get();
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  const userQuery = useQuery(['me', token], () => apiClient.auth.getMe(), {
    enabled: !!token,
  });

  return {
    user: userQuery.data?.data,
    userLoading: userQuery.isFetching,
    isUserAuthenticated:
      userQuery.status === 'success' && !!userQuery.data?.data,
    onUserLoginSuccess,
    refetchUser: () => userQuery.refetch(),
    isUserFetched: userQuery.isFetched,
    onUserLogout,
  };
};

const AuthProvider = ({
  children,
}: PropsWithChildren<Record<string, unknown>>) => {
  const data = useAuthProviderData();
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

export default AuthProvider;
