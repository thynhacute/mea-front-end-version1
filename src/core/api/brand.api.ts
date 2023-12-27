import { Brand } from '../models/brand';
import { EnumListItem, IPagingDto, ResponseList } from '../models/common';
import http from './http';

export interface BrandIV1Get extends IPagingDto {}

export interface BrandIV1CreateDto extends Pick<Brand, 'name' | 'code' | 'description' | 'status' | 'imageUrl'> {}

export interface BrandIV1UpdateDto extends Pick<Brand, 'name' | 'code' | 'description' | 'status' | 'imageUrl'> {}

const baseEndpoint = '/v1/brand';

export const brandApi = {
  v1Get: async (dto: BrandIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<Brand>>(url, { params: { ...dto } });
    return res.data;
  },
  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<Brand>(url);
    return res.data;
  },
  v1Create: async (dto: BrandIV1CreateDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<Brand>(url, dto);
    return res.data;
  },
  v1Update: async (id: string, dto: BrandIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.put<Brand>(url, dto);
    return res.data;
  },
  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete<boolean>(url);
    return res.data;
  },
  v1GetEnumStatus: async () => {
    const url = `${baseEndpoint}/enum-options/status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },
  v1GetSelect: async (search: string) => {
    const url = `${baseEndpoint}/select-options?search=${search}`;
    const res = await http.get<Array<Brand>>(url);
    return res.data;
  },
  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<Array<Brand>>(url);
    return res.data;
  },
};
