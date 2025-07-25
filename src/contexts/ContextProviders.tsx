'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo, useState } from 'react';

const ExtProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => {
    return new QueryClient({});
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
};

const ContextProviders = ({ children }: { children: ReactNode }) => {
  const value = useMemo(() => {
    return <ExtProviders>{children}</ExtProviders>;
  }, [children]);

  return value;
};

export { ContextProviders };
