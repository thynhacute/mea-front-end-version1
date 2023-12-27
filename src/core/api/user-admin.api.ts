import { IPagingDto, ResponseList } from '../models/common';
import { User } from '../models/user';
import http from './http';

export interface UserIV1Get extends IPagingDto {}

export interface UserIV1Update
  extends Pick<User, 'startWorkDate' | 'name' | 'address' | 'birthday' | 'phone' | 'citizenId' | 'gender' | 'status' | 'password'> {
  departmentId: string;
  roleId: string;
}

export interface UserIV1Create extends Pick<User, 'password' | 'username' | 'startWorkDate'> {
  departmentId: string;
  roleId: string;
}

export const userAdminApi = {
  v1Get: async (dto: UserIV1Get) => {
    const url = '/v1/user-admin';
    const res = await http.get<ResponseList<User>>(url, { params: { ...dto } });
    return res.data;
  },
  v1GetById: async (id: string) => {
    const url = `/v1/user-admin/${id}`;
    const res = await http.get<User>(url);
    return res.data;
  },
  v1Update: async (id: string, dto: UserIV1Update) => {
    const url = `/v1/user-admin/update-user/${id}`;
    const res = await http.put<User>(url, dto);
    return res.data;
  },
  v1Create: async (dto: UserIV1Create) => {
    const url = '/v1/user-admin/create-user';
    const res = await http.post<User>(url, dto);
    return res.data;
  },
};
