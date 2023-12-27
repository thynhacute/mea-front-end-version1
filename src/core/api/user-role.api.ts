import { IPagingDto, ResponseList } from '../models/common';
import { UserRole } from '../models/userRole';
import http from './http';

export interface UserRoleIV1Get extends IPagingDto {}

export const userRoleApi = {
  v1All: async () => {
    const url = '/v1/user-role/all';
    const res = await http.get<UserRole[]>(url);
    return res.data;
  },
  v1Get: async (dto: UserRoleIV1Get) => {
    const url = '/v1/user-role';
    const res = await http.get<ResponseList<UserRole>>(url, { params: { ...dto } });
    return res.data;
  },
  v1GetById: async (id: string) => {
    const url = `/v1/user-role/${id}`;
    const res = await http.get<UserRole>(url);
    return res.data;
  },
  v1GetSelect: async (search: string) => {
    const url = `/v1/user-role/select-options`;
    const res = await http.get<UserRole[]>(url, {
      params: {
        search,
      },
    });

    return res.data;
  },
};
