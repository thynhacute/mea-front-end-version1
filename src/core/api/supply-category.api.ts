import { IPagingDto, ResponseList } from '../models/common';
import { SupplyCategory } from '../models/supplyCategory';
import http from './http';

export interface SupplyCategoryIV1Get extends IPagingDto {}

export interface SupplyCategoryIV1CreateDto extends Pick<SupplyCategory, 'name' | 'description'> {}

export interface SupplyCategoryIV1UpdateDto extends Pick<SupplyCategory, 'name' | 'description'> {}

const baseEndpoint = '/v1/supply-category';

export const supplyCategoryApi = {
  v1Get: async (dto: SupplyCategoryIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<SupplyCategory>>(url, { params: { ...dto } });
    return res.data;
  },
  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<SupplyCategory>(url);
    return res.data;
  },
  v1Create: async (dto: SupplyCategoryIV1CreateDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<SupplyCategory>(url, dto);
    return res.data;
  },
  v1Update: async (id: string, dto: SupplyCategoryIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.put<SupplyCategory>(url, dto);
    return res.data;
  },
  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete<boolean>(url);
    return res.data;
  },

  v1GetSelect: async (search: string) => {
    const url = `${baseEndpoint}/select-options?search=${search}`;
    const res = await http.get<Array<SupplyCategory>>(url);
    return res.data;
  },
  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<Array<SupplyCategory>>(url);
    return res.data;
  },
};
