import { User } from '../models/user';
import http from './http';

export interface IV1ChangePasswordDto {
  password: string;
  newPassword: string;
}

export interface IV1UpdateProfileDto {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
  gender: string;
}

export const userMeApi = {
  v1Get: async () => {
    const url = '/v1/user-me';
    const res = await http.get<User>(url);
    return res.data;
  },
  v1Put: async (dto: IV1UpdateProfileDto) => {
    const url = '/v1/user-me/';
    const res = await http.put<User>(url, dto);
    return res.data;
  },
  v1PutChangePassword: async (dto: IV1ChangePasswordDto) => {
    const url = '/v1/user-me/change-password';
    const res = await http.put<User>(url, dto);
    return res.data;
  },

  v1PostLogout: async () => {
    const url = '/v1/user-me/logout';
    const res = await http.post(url);
    return res.data;
  },
};
