import * as React from 'react';

import { useSelector } from 'react-redux';

import { UserRoleIndex } from '@/core/models/userRole';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';

interface RoleDisplayProps {
  children: React.ReactNode;
  acceptRole: UserRoleIndex;
}

const RoleDisplay: React.FC<RoleDisplayProps> = ({ children, acceptRole }) => {
  const userStoreState = useSelector<RootState, UserState>((state) => state.user);
  const [isDisplay, setIsDisplay] = React.useState(false);

  React.useEffect(() => {
    if (!(userStoreState.isAuth && acceptRole > (userStoreState.role?.index || 0))) {
      setIsDisplay(true);
    }
  }, [userStoreState.isAuth, userStoreState.isLogin, acceptRole]);

  return <>{isDisplay ? children : <></>}</>;
};

export default RoleDisplay;
