import { Action, Middleware } from 'redux';

import { userActions } from '.';
import { RootState } from '..';

export const userMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: Action) => {
  if (action.type.match(userActions.setUser)) {
  }
  next(action);
};
