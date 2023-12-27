import { IPagingDto, ResponseList } from '../models/common';
import { UserRole } from '../models/userRole';
import http from './http';

export interface UserRoleIV1Get extends IPagingDto {}

export const xlsxApi = {
  v1Create: async (
    dto: {
      [key: string]: any;
    }[],
  ) => {
    const url = '/xlsx/create';
    const res = await http.post<UserRole[]>(url, {
      data: dto,
    });
    return res.data;
  },
};
