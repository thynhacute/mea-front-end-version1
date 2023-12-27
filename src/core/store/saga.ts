import { all } from 'redux-saga/effects';

import apiSaga from './api/api.saga';
import userSaga from './user/user.saga';

export default function* rootSaga() {
  yield all([userSaga(), apiSaga()]);
}
