'use client';

import * as React from 'react';

import { useSelector } from 'react-redux';
import Cookies from 'universal-cookie';

import { NKConstant } from '@/core/NKConstant';
import { UserRoleIndex } from '@/core/models/userRole';
import { RootState } from '@/core/store';
import { ApiState } from '@/core/store/api/api.interface';
import { UserState } from '@/core/store/user';

interface RoleWrapperProps {
  children: React.ReactNode;
  userRoleIndex: UserRoleIndex;
}

const RoleWrapper: React.FC<RoleWrapperProps> = ({ children, userRoleIndex }) => {
  const userStoreState = useSelector<RootState, UserState>((state) => state.user);
  const apiStoreState = useSelector<RootState, ApiState>((state) => state.api);

  React.useEffect(() => {
    const cookies = new Cookies();

    if (userStoreState.isLogin && !userStoreState.isAuth) {
      cookies.remove(NKConstant.TOKEN_COOKIE_KEY);
      // window.location.reload();
    }

    if (userStoreState.isAuth && apiStoreState.roles.length) {
      if (userRoleIndex > (userStoreState.role?.index || 0)) {
        // cookies.remove(NKConstant.TOKEN_COOKIE_KEY);
        // window.location.reload();
      }
    }
  }, [userStoreState.isAuth, userStoreState.isLogin, apiStoreState.roles, userRoleIndex]);

  return <>{children}</>;
};

export default RoleWrapper;
