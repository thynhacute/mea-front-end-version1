'use client';

import * as React from 'react';

import { useSelector } from 'react-redux';

import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const { id } = useSelector<RootState, UserState>((state) => state.user);

  return <div className="grid grid-cols-2 gap-10"></div>;
};

export default Page;
