'use client';

import * as React from 'react';

import { useSelector } from 'react-redux';
import Cookies from 'universal-cookie';

import { NKConstant } from '@/core/NKConstant';
import { RootState, store } from '@/core/store';
import { UserState, userActions } from '@/core/store/user';

interface TryAuthWrapperProps {
  children: React.ReactNode;
}

const TryAuthWrapper: React.FC<TryAuthWrapperProps> = ({ children }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    if (isMounted) {
      const cookies = new Cookies();

      const currentToken = cookies.get(NKConstant.TOKEN_COOKIE_KEY) || '';

      store.dispatch(userActions.setToken(currentToken));
    } else {
      setIsMounted(true);
    }
  }, [isMounted]);

  return <>{children}</>;
};

export default TryAuthWrapper;
