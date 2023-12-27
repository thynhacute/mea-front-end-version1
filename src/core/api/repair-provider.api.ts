import { EnumListItem, IPagingDto, ResponseList } from '../models/common';
import { RepairProvider } from '../models/repairProvider';
import http from './http';

const baseEndpoint = '/v1/repair-provider';

export interface RepairProviderIV1Get extends IPagingDto {}
export interface RepairProviderIV1CreateDto extends Pick<RepairProvider, 'name' | 'address' | 'email' | 'startWorkDate' | 'phone' | 'isExternal'> {}
export interface RepairProviderIV1UpdateDto
  extends Pick<RepairProvider, 'name' | 'address' | 'email' | 'startWorkDate' | 'phone' | 'isExternal' | 'status'> {}

export const repairProviderApi = {
  v1Get: async (dto: RepairProviderIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<RepairProvider>>(url, { params: { ...dto } });
    return res.data;
  },
  v1Create: async (dto: RepairProviderIV1CreateDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<RepairProvider>(url, dto);
    return res.data;
  },

  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<RepairProvider>(url);
    return res.data;
  },

  v1Update: async (id: string, dto: RepairProviderIV1CreateDto) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.put<RepairProvider>(url, dto);
    return res.data;
  },

  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<Array<RepairProvider>>(url);
    return res.data;
  },

  v1GetEnumStatus: async () => {
    const url = `${baseEndpoint}/enum-options/status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },

  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete(url);
    return res.data;
  },
  v1GetSelect: async (search: string) => {
    const url = `${baseEndpoint}/select-options?search=${search}`;
    const res = await http.get<Array<RepairProvider>>(url);
    return res.data;
  },
};
