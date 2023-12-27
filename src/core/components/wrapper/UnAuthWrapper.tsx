'use client';

import * as React from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useSelector } from 'react-redux';

import { NKConstant } from '@/core/NKConstant';
import { NKRouter } from '@/core/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface UnAuthWrapperProps {
  children: React.ReactNode;
}

const UnAuthWrapper: React.FC<UnAuthWrapperProps> = ({ children }) => {
  const { isAuth, id, isLogin, role } = useSelector<RootState, UserState>((state) => state.user);
  const router = useRouter();
  const pathName = usePathname();

  React.useEffect(() => {
    if (isLogin && isAuth && id && pathName === NKConstant.AUTH_FAILED_FALLBACK_ROUTE) {
      switch (role?.name) {
        case 'Admin':
          router.push(NKRouter.admin.dashboard());
          break;
        case 'user':
          // router.push(NKConstant.USER_DASHBOARD_ROUTE);
          break;
        default:
          router.push(NKRouter.admin.dashboard());
          // router.push(NKConstant.AUTH_LOGIN_ROUTE);
          break;
      }
    }
  }, [isAuth, id, isLogin]);

  return <>{children}</>;
};

export default UnAuthWrapper;
