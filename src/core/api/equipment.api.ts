import { EnumListItem, IPagingDto, ResponseList } from '../models/common';
import { Equipment } from '../models/equipment';
import http from './http';

export interface EquipmentIV1Get extends IPagingDto {}

export interface EquipmentIV1GetSearch extends IPagingDto {}

export interface EquipmentIV1CreateDto
  extends Pick<Equipment, 'name' | 'code' | 'description' | 'mfDate' | 'endOfWarrantyDate' | 'imageUrls' | 'importDate'> {
  equipmentCategoryId: string;
  brandId: string;
  equipmentStatus: string;
}

export interface EquipmentIV1UpdateDto
  extends Pick<Equipment, 'name' | 'code' | 'description' | 'mfDate' | 'endOfWarrantyDate' | 'imageUrls' | 'importDate'> {
  equipmentCategoryId: string;
  brandId: string;
}

export interface ChangeDepartmentDto {
  departmentId: string;
  note: string;
}

export interface EquipmentIV1UpdateStatusDto {
  status: string;
  note: string;
}

const baseEndpoint = '/v1/equipment';

export const equipmentApi = {
  v1Get: async (dto: EquipmentIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<Equipment>>(url, { params: { ...dto } });
    return res.data;
  },
  v1GetSearch: async (dto: EquipmentIV1Get) => {
    const url = `${baseEndpoint}/search`;
    const res = await http.get<ResponseList<EquipmentIV1GetSearch>>(url, { params: { ...dto } });
    return res.data;
  },
  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<Equipment>(url);
    return res.data;
  },
  v1GetStatus: async (id: string) => {
    const url = `${baseEndpoint}/status/${id}`;
    const res = await http.get<Equipment>(url);
    return res.data;
  },
  v1UpdateStatus: async (id: string, dto: EquipmentIV1UpdateStatusDto) => {
    const url = `${baseEndpoint}/status/${id}`;
    const res = await http.put<Equipment>(url, dto);
    return res.data;
  },
  v1Create: async (dto: EquipmentIV1CreateDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<Equipment>(url, dto);
    return res.data;
  },
  v1Update: async (id: string, dto: EquipmentIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.put<Equipment>(url, dto);
    return res.data;
  },
  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete<boolean>(url);
    return res.data;
  },
  v1GetByDepartment: async (departmentId: string, dto: EquipmentIV1Get) => {
    const url = `${baseEndpoint}/department/${departmentId}`;
    const res = await http.get<Array<EquipmentIV1GetSearch>>(url, { params: { ...dto } });
    return res.data;
  },

  v1Select: async (search: string) => {
    const url = `${baseEndpoint}/select-options?search=${search}`;
    const res = await http.get<Array<Equipment>>(url);
    return res.data;
  },
  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<Array<Equipment>>(url);
    return res.data;
  },
  v1ChangeDepartment: async (id: string, dto: ChangeDepartmentDto) => {
    const url = `${baseEndpoint}/department/${id}`;
    const res = await http.put<Equipment>(url, dto);
    return res.data;
  },
};
