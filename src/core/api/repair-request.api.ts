import { EnumListItem, IPagingDto, ResponseList } from '../models/common';
import { RepairRequest } from '../models/repartRequest';
import http from './http';

export interface RepairRequestIV1Get extends IPagingDto {}

export interface RepairRequestIV1CreateDto extends Pick<RepairRequest, 'description' | 'imageUrls'> {
  equipmentId: string;
}

export interface RepairRequestIV1UpdateDto extends Pick<RepairRequest, 'description' | 'imageUrls' | 'status'> {
  equipmentId: string;
}

export interface RepairRequestIV1UpdateCancelDto extends Pick<RepairRequest, 'note'> {}

export interface RepairRequestIV1UpdateApproveDto extends Pick<RepairRequest, 'note'> {}

const baseEndpoint = '/v1/repair-request';

export const repairRequestApi = {
  v1Get: async (dto: RepairRequestIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<RepairRequest>>(url, { params: { ...dto } });
    return res.data;
  },
  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<RepairRequest[]>(url);
    return res.data;
  },
  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<RepairRequest>(url);
    return res.data;
  },
  v1Create: async (dto: RepairRequestIV1CreateDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<RepairRequest>(url, dto);
    return res.data;
  },
  v1Update: async (id: string, dto: RepairRequestIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.put<RepairRequest>(url, dto);
    return res.data;
  },
  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete<RepairRequest>(url);
    return res.data;
  },
  v1GetEnumStatus: async () => {
    const url = `${baseEndpoint}/enum-options/status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },
  v1UpdateCancel: async (id: string, dto: RepairRequestIV1UpdateCancelDto) => {
    const url = `${baseEndpoint}/${id}/cancel`;
    const res = await http.put<RepairRequest>(url, dto);
    return res.data;
  },
  v1UpdateApprove: async (id: string, dto: RepairRequestIV1UpdateApproveDto) => {
    const url = `${baseEndpoint}/${id}/approve`;
    const res = await http.put<RepairRequest>(url, dto);
    return res.data;
  },
};
