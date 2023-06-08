import React from 'react';
import { QueryClient, dehydrate } from '@tanstack/query-core';
import { ReactQueryWrapper } from './ReactQueryWrapper';

interface ProviderProps {
  children?: React.ReactNode;
}

const QueryProvider = ({ children }: ProviderProps) => {
  const queryClient = new QueryClient();

  const provider = (
    <ReactQueryWrapper dehydratedState={dehydrate(queryClient)}>
      {children}
    </ReactQueryWrapper>
  );

  queryClient.clear();
  return provider;
};

export default QueryProvider;
