import { EnumListItem, IPagingDto, ResponseList } from '../models/common';
import { Department } from '../models/department';
import http from './http';

export interface DepartmentIV1Get extends IPagingDto {}

export interface DepartmentIV1CreateDto extends Pick<Department, 'name' | 'description'> {}

export interface DepartmentIV1UpdateDto extends Pick<Department, 'name' | 'description' | 'status'> {}

const baseEndpoint = '/v1/department';

export const departmentApi = {
  v1Get: async (dto: DepartmentIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<Department>>(url, { params: { ...dto } });
    return res.data;
  },
  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<Department[]>(url);
    return res.data;
  },
  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<Department>(url);
    return res.data;
  },
  v1Create: async (dto: DepartmentIV1CreateDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<Department>(url, dto);
    return res.data;
  },
  v1Update: async (id: string, dto: DepartmentIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.put<Department>(url, dto);
    return res.data;
  },
  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete<Department>(url);
    return res.data;
  },
  v1GetEnumStatus: async () => {
    const url = `${baseEndpoint}/enum-options/status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },
  v1GetSelect: async (search: string) => {
    const url = `${baseEndpoint}/select-options`;
    const res = await http.get<Department[]>(url, {
      params: {
        search,
      },
    });

    return res.data;
  },
};
