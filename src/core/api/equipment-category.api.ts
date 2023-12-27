import { IPagingDto, ResponseList } from '../models/common';
import { EquipmentCategory } from '../models/equipmentCategory';
import http from './http';

export interface EquipmentCategoryIV1Get extends IPagingDto {}

export interface EquipmentCategoryIV1CreateDto extends Pick<EquipmentCategory, 'name' | 'code' | 'description'> {}

export interface EquipmentCategoryIV1UpdateDto extends Pick<EquipmentCategory, 'name' | 'code' | 'description'> {}

const baseEndpoint = '/v1/equipment-category';

export const equipmentCategoryApi = {
  v1Get: async (dto: EquipmentCategoryIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<EquipmentCategory>>(url, { params: { ...dto } });
    return res.data;
  },
  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<EquipmentCategory>(url);
    return res.data;
  },
  v1Create: async (dto: EquipmentCategoryIV1CreateDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<EquipmentCategory>(url, dto);
    return res.data;
  },
  v1Update: async (id: string, dto: EquipmentCategoryIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.put<EquipmentCategory>(url, dto);
    return res.data;
  },
  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete<boolean>(url);
    return res.data;
  },

  v1GetSelect: async (search: string) => {
    const url = `${baseEndpoint}/select-options?search=${search}`;
    const res = await http.get<Array<EquipmentCategory>>(url);
    return res.data;
  },
  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<Array<EquipmentCategory>>(url);
    return res.data;
  },
};
