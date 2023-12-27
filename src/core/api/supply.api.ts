import { EnumListItem, IPagingDto, ResponseList } from '../models/common';
import { Supply } from '../models/supply';
import http from './http';

export interface SupplyIV1Get extends IPagingDto {}

export interface SupplyIV1GetSearch extends IPagingDto {}

export interface SupplyIV1CreateDto extends Pick<Supply, 'name' | 'code' | 'description' | 'status' | 'imageUrls' | 'unit'> {
  brandId: string;
  supplyCategoryId: string;
  equipmentCategoryId: string;
}

export interface SupplyIV1UpdateDto extends Pick<Supply, 'name' | 'code' | 'description' | 'status' | 'imageUrls' | 'unit'> {
  brandId: string;
  supplyCategoryId: string;
  equipmentCategoryId: string;
}

const baseEndpoint = '/v1/supply';

export const supplyApi = {
  v1Get: async (dto: SupplyIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<Supply>>(url, { params: { ...dto } });
    return res.data;
  },
  v1GetSearch: async (dto: SupplyIV1Get) => {
    const url = `${baseEndpoint}/search`;
    const res = await http.get<ResponseList<SupplyIV1GetSearch>>(url, { params: { ...dto } });
    return res.data;
  },
  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<Supply>(url);
    return res.data;
  },
  v1Create: async (dto: SupplyIV1CreateDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<Supply>(url, dto);
    return res.data;
  },
  v1Update: async (id: string, dto: SupplyIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.put<Supply>(url, dto);
    return res.data;
  },
  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete<boolean>(url);
    return res.data;
  },
  v1GetEquipmentCategory: async (equipmentCategoryId: string) => {
    const url = `${baseEndpoint}/equipment-category/${equipmentCategoryId}`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },
  v1GetEquipment: async (equipmentId: string) => {
    const url = `${baseEndpoint}/equipment/${equipmentId}`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },

  v1GetEnumStatus: async () => {
    const url = `${baseEndpoint}/enum-options/status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },
  v1GetEnumQuantityStatus: async () => {
    const url = `${baseEndpoint}/enum-options/quantity-status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },
  v1Select: async (search: string) => {
    const url = `${baseEndpoint}/select-options?search=${search}`;
    const res = await http.get<Array<Supply>>(url);
    return res.data;
  },
  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<Array<Supply>>(url);
    return res.data;
  },
  v1GetCode: async (code: string) => {
    const url = `${baseEndpoint}/code/${code}`;
    const res = await http.get<Supply>(url);
    return res.data;
  },
};
