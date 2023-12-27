'use client';

import * as React from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useSelector } from 'react-redux';
import Cookies from 'universal-cookie';

import { NKConstant } from '@/core/NKConstant';
import { equipmentApi } from '@/core/api/equipment.api';
import { supplyApi } from '@/core/api/supply.api';
import { RootState, store } from '@/core/store';
import { UserState, userActions } from '@/core/store/user';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuth, isLogin } = useSelector<RootState, UserState>((state) => state.user);
  const router = useRouter();
  const pathName = usePathname();

  React.useEffect(() => {
    if (isAuth && pathName === NKConstant.AUTH_FAILED_FALLBACK_ROUTE) {
      router.push(NKConstant.AUTH_SUCCESS_FALLBACK_ROUTE);
    }

    if (isLogin && !isAuth) {
      router.push(NKConstant.AUTH_FAILED_FALLBACK_ROUTE);
    }
  }, [isAuth, pathName, isLogin]);

  React.useEffect(() => {
    equipmentApi.v1Get({
      filters: [],
      orderBy: [],
      page: 0,
      pageSize: 10,
    });
  }, []);

  React.useEffect(() => {
    supplyApi.v1Get({
      filters: [],
      orderBy: [],
      page: 0,
      pageSize: 10,
    });
  }, []);

  return <>{children}</>;
};

export default AuthWrapper;
