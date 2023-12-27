import { call, put, takeLatest } from 'redux-saga/effects';

import { userRoleApi } from '@/core/api/user-role.api';

import { apiActions } from '.';

function* getAllUserRole(): any {
  const userRoles = yield call(userRoleApi.v1All);

  yield put(apiActions.setRoles(userRoles));
}

export default function* apiSaga() {
  yield takeLatest(apiActions.getRoles, getAllUserRole);
}
