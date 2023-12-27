import { EnumListItem, IPagingDto, IReportDto, ResponseList } from '../models/common';
import { RepairReport } from '../models/repairReport';
import { RepairReplaceItem, RepairReportItem } from '../models/repairReportItem';
import http from './http';

export interface RepairReplaceItemDto extends Pick<RepairReplaceItem, 'quantity'> {
  supplyId: string;
}

export interface RepairReportItemDto extends Pick<RepairReportItem, 'description' | 'imageUrls'> {
  equipmentId: string;
  replaceItems: RepairReplaceItemDto[];
}

export interface RepairReportIV1Get extends IPagingDto {}
export interface RepairReportIV1Item {
  description: string;
  imageUrls: string[];
  equipmentId: string;
  replaceItems: RepairReplaceItemDto[];
  repairProviderIds: string[];
}

export interface RepairReportV1ReplaceItem {
  quantity: number;
  supplyId: string;
}

export interface RepairReportIV1CreateDto extends Pick<RepairReport, 'description' | 'note' | 'startAt' | 'endAt' | 'price' | 'brokenDate'> {
  repairReportItems: RepairReportIV1Item[];
}

export interface RepairReportIV1UpdateDto
  extends Pick<RepairReport, 'status' | 'description' | 'note' | 'startAt' | 'endAt' | 'price' | 'brokenDate'> {}

export interface RepairReportItemIV1CreateDto extends Pick<RepairReportItem, 'description' | 'name' | 'type' | 'imageUrls'> {
  equipmentId: string;
  replaceItems: string[];
}

export interface RepairReportItemIV1UpdateDto extends Pick<RepairReportItem, 'description' | 'type' | 'imageUrls' | 'status'> {
  repairProviderIds: string[];
}

export interface RepairReplaceItemIV1CreateDto extends Pick<RepairReplaceItem, 'quantity'> {
  supplyId: string;
}

export interface RepairReplaceItemIV1UpdateDto extends Pick<RepairReplaceItem, 'quantity'> {}

const baseEndpoint = '/v1/repair-report';

export const repairReportApi = {
  v1Get: async (dto: RepairReportIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<RepairReport>>(url, { params: { ...dto } });
    return res.data;
  },
  v1Create: async (dto: RepairReportIV1CreateDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<RepairReport>(url, dto);
    return res.data;
  },

  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<RepairReport>(url);
    return res.data;
  },

  v1Update: async (id: string, dto: RepairReportIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.put<RepairReport>(url, dto);
    return res.data;
  },

  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete<RepairReport>(url);
    return res.data;
  },

  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<Array<RepairReport>>(url);
    return res.data;
  },

  v1GetEnumStatus: async () => {
    const url = `${baseEndpoint}/enum-options/status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },

  v1CreateItem: async (id: string, dto: RepairReportIV1Item) => {
    const url = `${baseEndpoint}/${id}/item`;
    const res = await http.post<RepairReportItem>(url, dto);
    return res.data;
  },
  v1CreateReplaceItem: async (id: string, itemId: string, dto: RepairReplaceItemIV1CreateDto) => {
    const url = `${baseEndpoint}/${id}/item/${itemId}/repair-replace-item`;
    const res = await http.post<RepairReplaceItem>(url, dto);
    return res.data;
  },
  v1UpdateReplaceItem: async (id: string, itemId: string, replaceItemId: string, dto: RepairReplaceItemIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}/item/${itemId}/repair-replace-item/${replaceItemId}`;
    const res = await http.put<RepairReplaceItem>(url, dto);
    return res.data;
  },
  v1DeleteReplaceItem: async (id: string, itemId: string, replaceItemId: string) => {
    const url = `${baseEndpoint}/${id}/item/${itemId}/repair-replace-item/${replaceItemId}`;
    const res = await http.delete<RepairReplaceItem>(url);
    return res.data;
  },

  v1UpdateItem: async (id: string, itemId: string, dto: RepairReportItemIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}/item/${itemId}`;
    const res = await http.put<RepairReportItem>(url, dto);
    return res.data;
  },

  v1DeleteItem: async (id: string, itemId: string) => {
    const url = `${baseEndpoint}/${id}/item/${itemId}`;
    const res = await http.delete<RepairReportItem>(url);
    return res.data;
  },
  v1GetEquipment: async (id: string) => {
    const url = `${baseEndpoint}/equipment/${id}`;
    const res = await http.get<RepairReportItem[]>(url);
    return res.data;
  },
  v1GetReport: async (dto: IReportDto) => {
    const url = `${baseEndpoint}/report`;
    const res = await http.get<any[]>(url, { params: { ...dto } });
    return res.data;
  },
};
