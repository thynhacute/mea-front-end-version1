'use client';

import * as React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

interface TanQueryClientProps {
  children: React.ReactNode;
}

const TanQueryClient: React.FC<TanQueryClientProps> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default TanQueryClient;
