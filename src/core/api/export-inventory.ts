import { EnumListItem, IPagingDto, IReportDto, ReportResponse, ResponseList } from '../models/common';
import { ExportInventoryItem } from '../models/exportInventoryItem';
import { Supply } from '../models/supply';
import { ExportInventory } from './../models/exportInventory';
import http from './http';

export interface ExportInventoryItemDto {
  quantity: number;
  supplyId: string;
  equipmentId: string;
}

export interface ExportInventoryIV1Get extends IPagingDto {}
export interface ExportInventoryIV1CreateDto extends Pick<ExportInventory, 'exportDate' | 'note'> {
  departmentId: string;
  importRequestId: string;
}

export interface ExportInventoryIV1UpdateDto extends Pick<ExportInventory, 'exportDate' | 'note'> {
  departmentId: string;
  importRequestId: string;
}
export interface ExportInventoryItemIV1CreateDto extends Pick<ExportInventoryItem, 'quantity' | 'note'> {
  supplyId: string | null;
  equipmentId: string | null;
}

export interface ExportInventoryItemIV1UpdateDto extends Pick<ExportInventoryItem, 'quantity' | 'note'> {}

export interface ExportInventoryIVUpdateApproveDto {
  note: string;
}

export interface ExportInventoryIVUpdateCancelDto {
  note: string;
}

const baseEndpoint = '/v1/export-inventory';
export const exportInventoryApi = {
  v1Get: async (dto: ExportInventoryIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<ExportInventory>>(url, { params: { ...dto } });
    return res.data;
  },
  v1Create: async (dto: ExportInventoryIV1CreateDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<ExportInventory>(url, dto);
    return res.data;
  },

  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<ExportInventory>(url);
    return res.data;
  },

  v1Update: async (id: string, dto: ExportInventoryIV1CreateDto) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.put<ExportInventory>(url, dto);
    return res.data;
  },

  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<Array<ExportInventory>>(url);
    return res.data;
  },

  v1GetSelect: async (search: string) => {
    const url = `${baseEndpoint}/select-options?search=${search}`;
    const res = await http.get<Array<ExportInventory>>(url);
    return res.data;
  },

  v1GetEnumStatus: async () => {
    const url = `${baseEndpoint}/enum-options/status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },

  v1UpdateApprove: async (id: string, dto: ExportInventoryIVUpdateApproveDto) => {
    const url = `${baseEndpoint}/${id}/approve`;
    const res = await http.put<ExportInventory>(url, dto);
    return res.data;
  },

  v1UpdateSubmit: async (id: string) => {
    const url = `${baseEndpoint}/${id}/submit`;
    const res = await http.put<ExportInventory>(url);
    return res.data;
  },

  v1UpdateCancel: async (id: string, dto: ExportInventoryIVUpdateCancelDto) => {
    const url = `${baseEndpoint}/${id}/cancel`;
    const res = await http.put<ExportInventory>(url, dto);
    return res.data;
  },

  v1CreateItem: async (id: string, dto: ExportInventoryItemIV1CreateDto) => {
    const url = `${baseEndpoint}/${id}/item`;
    const res = await http.post<ExportInventory>(url, dto);
    return res.data;
  },

  v1UpdateItem: async (id: string, itemId: string, dto: ExportInventoryItemIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}/item/${itemId}`;
    const res = await http.put<ExportInventory>(url, dto);
    return res.data;
  },

  v1DeleteItem: async (id: string, itemId: string) => {
    const url = `${baseEndpoint}/${id}/item/${itemId}`;
    const res = await http.delete<ExportInventory>(url);
    return res.data;
  },
  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete<ExportInventory>(url);
    return res.data;
  },
  v1GetReport: async (dto: IReportDto) => {
    const url = `${baseEndpoint}/report`;
    const res = await http.get<ReportResponse[]>(url, { params: { ...dto } });
    return res.data;
  },
  v1GetSupplyByDepartment: async (departmentId: string) => {
    const url = `${baseEndpoint}/department/${departmentId}`;
    const res = await http.get<Supply[]>(url);
    return res.data;
  },
  v1GetBySupplyId: async (supplyId: string) => {
    const url = `${baseEndpoint}/supply/${supplyId}`;
    const res = await http.get<ExportInventory[]>(url);
    return res.data;
  },
};
