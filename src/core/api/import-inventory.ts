import { EnumListItem, IPagingDto, IReportDto, ReportResponse, ResponseList } from '../models/common';
import { ImportInventory } from '../models/importInventory';
import { ImportInventoryItem } from '../models/importInventoryItem';
import http from './http';

export interface ImportInventoryIV1Get extends IPagingDto {}
export interface ImportInventoryIV1CreateDto extends Pick<ImportInventory, 'name' | 'note' | 'importDate'> {
  importPlanId: string;
}

export interface ImportInventoryIV1UpdateDto extends Pick<ImportInventory, 'name' | 'note' | 'importDate'> {
  importPlanId: string;
}
export interface ImportInventoryItemIV1CreateDto
  extends Pick<ImportInventoryItem, 'quantity' | 'note' | 'price' | 'mfDate' | 'expiredDate' | 'endOfWarrantyDate'> {
  supplyId: string | null;
  equipmentId: string | null;
}

export interface ImportInventoryItemIV1CreateEquipmentDto extends Pick<ImportInventoryItem, 'quantity' | 'note' | 'price' | 'expiredDate'> {
  name: string;
  code: string;
  description: string;
  mfDate: string;
  importDate: string;
  imageUrls: string[];
  equipmentStatus: string;
  equipmentCategoryId: string;
  brandId: string;
  endOfWarrantyDate: string;
  equipmentId: string | null;
  supplyId: string | null;
}

export interface ImportInventoryItemIV1CancelDto {
  note: string;
}

export interface ImportInventoryItemIV1ApproveDto {
  note: string;
}

export interface ImportInventoryItemIV1UpdateDto
  extends Pick<ImportInventoryItem, 'quantity' | 'note' | 'price' | 'mfDate' | 'expiredDate' | 'endOfWarrantyDate'> {}

const baseEndpoint = '/v1/import-inventory';
export const importInventoryApi = {
  v1Get: async (dto: ImportInventoryIV1Get) => {
    const url = `${baseEndpoint}`;

    const res = await http.get<ResponseList<ImportInventory>>(url, { params: { ...dto } });
    return res.data;
  },
  v1Create: async (dto: ImportInventoryIV1CreateDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<ImportInventory>(url, dto);
    return res.data;
  },

  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<ImportInventory>(url);
    return res.data;
  },

  v1Update: async (id: string, dto: ImportInventoryIV1CreateDto) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.put<ImportInventory>(url, dto);
    return res.data;
  },

  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<Array<ImportInventory>>(url);
    return res.data;
  },

  v1GetSelect: async (search: string) => {
    const url = `${baseEndpoint}/select-options?search=${search}`;
    const res = await http.get<Array<ImportInventory>>(url);
    return res.data;
  },

  v1GetEnumStatus: async () => {
    const url = `${baseEndpoint}/enum-options/status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },

  v1UpdateApprove: async (id: string, dto: ImportInventoryItemIV1ApproveDto) => {
    const url = `${baseEndpoint}/${id}/approve`;
    const res = await http.put<ImportInventory>(url, dto);
    return res.data;
  },

  v1UpdateSubmit: async (id: string) => {
    const url = `${baseEndpoint}/${id}/submit`;
    const res = await http.put<ImportInventory>(url);
    return res.data;
  },

  v1UpdateCancel: async (id: string, dto: ImportInventoryItemIV1CancelDto) => {
    const url = `${baseEndpoint}/${id}/cancel`;
    const res = await http.put<ImportInventory>(url, dto);
    return res.data;
  },

  v1CreateItem: async (id: string, dto: ImportInventoryItemIV1CreateDto) => {
    const url = `${baseEndpoint}/${id}/item`;
    const res = await http.post<ImportInventory>(url, dto);
    return res.data;
  },
  v1CreateEquipmentItem: async (id: string, dto: ImportInventoryItemIV1CreateEquipmentDto) => {
    const url = `${baseEndpoint}/${id}/item`;
    const res = await http.post<ImportInventory>(url, dto);
    return res.data;
  },

  v1UpdateItem: async (id: string, itemId: string, dto: ImportInventoryItemIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}/item/${itemId}`;
    const res = await http.put<ImportInventory>(url, dto);
    return res.data;
  },

  v1DeleteItem: async (id: string, itemId: string) => {
    const url = `${baseEndpoint}/${id}/item/${itemId}`;
    const res = await http.delete<ImportInventory>(url);
    return res.data;
  },
  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete<ImportInventory>(url);
    return res.data;
  },
  v1UpdateUpload: async (id: string, file: File) => {
    const url = `${baseEndpoint}/${id}/item/upload`;
    const formData = new FormData();
    formData.append('file', file);
    const res = await http.put<ImportInventory>(url, formData);
    return res.data;
  },
  v1GetReport: async (dto: IReportDto) => {
    const url = `${baseEndpoint}/report`;
    const res = await http.get<ReportResponse[]>(url, { params: { ...dto } });
    return res.data;
  },
  v1GetBySupply: async (supplyId: string) => {
    const url = `${baseEndpoint}/supply/${supplyId}`;
    const res = await http.get<Array<ImportInventory>>(url);
    return res.data;
  },
};
