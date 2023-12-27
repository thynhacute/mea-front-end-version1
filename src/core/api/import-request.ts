import { EnumListItem, IPagingDto, IReportDto, ResponseList } from '../models/common';
import { ImportRequest } from '../models/importRequest';
import { ImportRequestItem } from '../models/importRequestItem';
import http from './http';

const baseEndpoint = '/v1/import-request';

export interface ImportRequestItemDto extends Pick<ImportRequestItem, 'quantity'> {
  supplyId: string | null;
  equipmentId: string | null;
}

export interface ImportRequestIV1Get extends IPagingDto {}
export interface ImportRequestIV1CreateDto extends Pick<ImportRequest, 'name' | 'description' | 'expected'> {
  departmentId: string;
  importRequestItems: ImportRequestItemDto[];
}
export interface ImportRequestIV1UpdateDto extends Pick<ImportRequest, 'name' | 'description' | 'expected'> {
  departmentId: string;
}

export interface ChangeApproveQuantityDto extends Pick<ImportRequest, 'approveQuantity'> {}

export interface ImportRequestItemIV1CreateDto extends ImportRequestItemDto {}

export interface ImportRequestItemIV1UpdateDto extends ImportRequestItemDto {}

export interface ImportRequestV1ApproveDto extends Pick<ImportRequest, 'note'> {}
export interface ImportRequestV1CancelDto extends Pick<ImportRequest, 'note'> {}

export const importRequestApi = {
  v1Get: async (dto: ImportRequestIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<ImportRequest>>(url, { params: { ...dto } });
    return res.data;
  },
  v1Create: async (dto: ImportRequestIV1CreateDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<ImportRequest>(url, dto);
    return res.data;
  },

  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<ImportRequest>(url);
    return res.data;
  },

  v1Update: async (id: string, dto: ImportRequestIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.put<ImportRequest>(url, dto);
    return res.data;
  },

  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<Array<ImportRequest>>(url);
    return res.data;
  },

  v1GetSelect: async (search: string) => {
    const url = `${baseEndpoint}/select-options?search=${search}`;
    const res = await http.get<Array<ImportRequest>>(url);
    return res.data;
  },

  v1GetEnumStatus: async () => {
    const url = `${baseEndpoint}/enum-options/status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },

  v1GetEnumExpected: async () => {
    const url = `${baseEndpoint}/enum-options/expected`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },

  v1UpdateApprove: async (id: string, dto: ImportRequestV1ApproveDto) => {
    const url = `${baseEndpoint}/${id}/approve`;
    const res = await http.put<ImportRequest>(url, dto);
    return res.data;
  },

  v1UpdateSubmit: async (id: string) => {
    const url = `${baseEndpoint}/${id}/submit`;
    const res = await http.put<ImportRequest>(url);
    return res.data;
  },
  v1UpdateUpdated: async (id: string, dto: ImportRequestV1ApproveDto) => {
    const url = `${baseEndpoint}/${id}/updated`;
    const res = await http.put<ImportRequest>(url, dto);
    return res.data;
  },

  v1UpdateCancel: async (id: string, dto: ImportRequestV1CancelDto) => {
    const url = `${baseEndpoint}/${id}/cancel`;
    const res = await http.put<ImportRequest>(url, dto);
    return res.data;
  },

  v1CreateItem: async (id: string, dto: ImportRequestItemIV1CreateDto) => {
    const url = `${baseEndpoint}/${id}/item`;
    const res = await http.post<ImportRequest>(url, dto);
    return res.data;
  },

  v1UpdateItem: async (id: string, itemId: string, dto: ImportRequestItemIV1UpdateDto) => {
    const url = `${baseEndpoint}/${id}/item/${itemId}`;
    const res = await http.put<ImportRequest>(url, dto);
    return res.data;
  },
  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete(url);
    return res.data;
  },

  v1DeleteItem: async (id: string, itemId: string) => {
    const url = `${baseEndpoint}/${id}/item/${itemId}`;
    const res = await http.delete<ImportRequest>(url);
    return res.data;
  },
  v1GetReport: async (dto: IReportDto) => {
    const url = `${baseEndpoint}/report`;
    const res = await http.get<any[]>(url, { params: { ...dto } });
    return res.data;
  },
  v1ChangeApproveQuantity: async (id: string, dto: ChangeApproveQuantityDto) => {
    const url = `${baseEndpoint}/approve-quantity/${id}`;
    const res = await http.put<ImportRequest>(url, dto);
    return res.data;
  },
  v1ChangeComplete: async (id: string) => {
    const url = `${baseEndpoint}/change-complete/${id}`;
    const res = await http.put<ImportRequest>(url);
    return res.data;
  },
};
