import { User } from '../models/user';
import http from './http';

export interface IV1AuthRegister extends Pick<User, 'email' | 'password' | 'name'> {}
export interface IV1AuthLoginUsername extends Pick<User, 'username' | 'password'> {}

export const authApi = {
  v1Login: async (dto: IV1AuthLoginUsername) => {
    const url = '/v1/auth/login';
    const res = await http.post<{ token: string }>(url, dto);
    return res.data;
  },

  v1Register: async (dto: IV1AuthRegister) => {
    const url = '/v1/auth/register';
    const res = await http.post<{ token: string }>(url, dto);
    return res.data;
  },
};
