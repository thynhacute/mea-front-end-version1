import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { apiReducer } from './api';
import { ApiState } from './api/api.interface';
import { apiMiddleware } from './api/api.middleware';
import rootSaga from './saga';
import { UserState, userReducer } from './user';

const sageMiddleware = createSagaMiddleware();

const middleware: any[] = [sageMiddleware, apiMiddleware];
export interface RootState {
  api: ApiState;
  user: UserState;
}

const reducers = combineReducers({
  api: apiReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: reducers,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
});

sageMiddleware.run(rootSaga);
