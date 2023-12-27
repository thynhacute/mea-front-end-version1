import { Action, Middleware } from 'redux';

import { apiActions } from '.';
import { RootState } from '..';
import { userActions } from '../user';

export const apiMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: Action) => {
  if (action.type.match(userActions.setUser)) {
    store.dispatch(apiActions.getRoles());
  }

  return next(action);
};
