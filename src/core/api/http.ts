import axios, { AxiosError } from 'axios';
import _get from 'lodash.get';
import Cookies from 'universal-cookie';

import { NKConfig } from '../NKConfig';
import { NKConstant } from '../NKConstant';
import { store } from '../store';
import { apiActions } from '../store/api';
import { lowerCaseField } from '../utils/object.helper';

export const http = axios.create({
  baseURL: NKConfig.API_URL,
  withCredentials: true,
});

http.interceptors.request.use(function (req) {
  const cookies = new Cookies();
  const token = cookies.get(NKConstant.TOKEN_COOKIE_KEY) || '';

  if (token && req.headers) req.headers[NKConstant.TOKEN_HEADER_KEY] = `Bearer ${token}`;

  return req;
});
http.interceptors.response.use(
  function (response) {
    store.dispatch(apiActions.resetState());
    return response;
  },

  function (error: AxiosError) {
    // if (error.response?.status === 401) {
    //   const cookies = new Cookies();
    //   cookies.remove(NKConstant.TOKEN_COOKIE_KEY);
    // }
    if (error.response?.status === 400) {
      store.dispatch(apiActions.resetState());
      if (error.response?.status) store.dispatch(apiActions.updateErrorDetails(lowerCaseField(_get(error, 'response.data', {} as any))));
    }

    return Promise.reject(error.response);
  },
);
export default http;
