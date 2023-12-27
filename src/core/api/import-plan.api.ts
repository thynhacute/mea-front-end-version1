import { EnumListItem, IPagingDto, IReportDto, ResponseList } from '../models/common';
import { ImportPlan } from '../models/importPlan';
import { ImportPlanItem } from '../models/importPlanItem';
import http from './http';

const baseEndpoint = '/v1/import-plan';

export interface ImportPlanIV1Get extends IPagingDto {}
export interface UpdateStatusImportPlan extends Pick<ImportPlan, 'note'> {}
export interface ImportPlanIV1CreateDto extends Pick<ImportPlan, 'startImportDate' | 'endImportDate' | 'name'> {}
export interface ImportPlanIV1UpdateDto extends Pick<ImportPlan, 'startImportDate' | 'endImportDate' | 'name'> {}

export interface ImportPlanItemIV1CreateDto
  extends Pick<ImportPlanItem, 'name' | 'code' | 'machine' | 'category' | 'brand' | 'description' | 'quantity' | 'price' | 'contact' | 'unit'> {}

export interface ImportPlanItemIV1UpdateDto
  extends Pick<ImportPlanItem, 'name' | 'code' | 'machine' | 'category' | 'brand' | 'description' | 'quantity' | 'price' | 'contact' | 'unit'> {}

export const importPlanApi = {
  v1Get: async (dto: ImportPlanIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<ImportPlan>>(url, { params: { ...dto } });
    return res.data;
  },
  v1Create: async (dto: ImportPlanIV1CreateDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<ImportPlan>(url, dto);
    return res.data;
  },

  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<ImportPlan>(url);
    return res.data;
  },

  v1Update: async (id: string, dto: ImportPlanIV1CreateDto) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.put<ImportPlan>(url, dto);
    return res.data;
  },

  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<Array<ImportPlan>>(url);
    return res.data;
  },

  v1GetSelect: async (search: string) => {
    const url = `${baseEndpoint}/select-options?search=${search}`;
    const res = await http.get<Array<ImportPlan>>(url);
    return res.data;
  },

  v1GetEnumStatus: async () => {
    const url = `${baseEndpoint}/enum-options/status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },

  v1UpdateApprove: async (id: string, dto: UpdateStatusImportPlan) => {
    const url = `${baseEndpoint}/${id}/approve`;
    const res = await http.put<ImportPlan>(url, dto);
    return res.data;
  },

  v1UpdateSubmit: async (id: string) => {
    const url = `${baseEndpoint}/${id}/submit`;
    const res = await http.put<ImportPlan>(url);
    return res.data;
  },

  v1UpdateCancel: async (id: string, dto: UpdateStatusImportPlan) => {
    const url = `${baseEndpoint}/${id}/cancel`;
    const res = await http.put<ImportPlan>(url, dto);
    return res.data;
  },

  v1CreateItem: async (id: string, dto: ImportPlanItemIV1CreateDto) => {
    const url = `${baseEndpoint}/${id}/item`;
    const res = await http.post<ImportPlanItem>(url, dto);
    return res.data;
  },

  v1UpdateItem: async (id: string, itemId: string, dto: ImportPlanItemIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}/item/${itemId}`;
    const res = await http.put<ImportPlanItem>(url, dto);
    return res.data;
  },

  v1DeleteItem: async (id: string, itemId: string) => {
    const url = `${baseEndpoint}/${id}/item/${itemId}`;
    const res = await http.delete<ImportPlanItem>(url);
    return res.data;
  },
  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete(url);
    return res.data;
  },

  v1UpdateUpload: async (id: string, file: File) => {
    const url = `${baseEndpoint}/${id}/item/upload`;
    const formData = new FormData();
    formData.append('file', file);
    const res = await http.put<ImportPlan>(url, formData);
    return res.data;
  },
  v1GetReport: async (dto: IReportDto) => {
    const url = `${baseEndpoint}/report`;
    const res = await http.get<any[]>(url, { params: { ...dto } });
    return res.data;
  },
  v1ChangeComplete: async (id: string) => {
    const url = `${baseEndpoint}/change-complete/${id}`;
    const res = await http.put<any>(url);
    return res.data;
  },
};
