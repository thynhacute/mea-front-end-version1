'use client';

import * as React from 'react';

import { useSelector } from 'react-redux';

import AdminChart from '@/core/components/compound/AdminChart';
import FacilityManager from '@/core/components/compound/FacilityManager';
import RepairChart from '@/core/components/compound/RepairChart';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const userStoreState = useSelector<RootState, UserState>((state) => state.user);

  if (!userStoreState.isAuth) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (userStoreState.isAdmin) {
    return <AdminChart />;
  }

  if (userStoreState.isMaintenanceManager) {
    return <RepairChart />;
  }

  if (userStoreState.isFacilityManager) {
    return <FacilityManager />;
  }

  return <AdminChart />;
};

export default Page;
