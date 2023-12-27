import { EnumListItem, IPagingDto, ResponseList } from '../models/common';
import { RepairReportItem } from '../models/repairReportItem';
import http from './http';

export interface RepairReportItemIV1Get extends IPagingDto {}

const baseEndpoint = '/v1/repair-report-item';

export const repairReportItemApi = {
  v1Get: async (dto: RepairReportItemIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<RepairReportItem>>(url, { params: { ...dto } });
    return res.data;
  },

  v1GetById: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.get<RepairReportItem>(url);
    return res.data;
  },

  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete<RepairReportItem>(url);
    return res.data;
  },

  v1GetAll: async () => {
    const url = `${baseEndpoint}/all`;
    const res = await http.get<Array<RepairReportItem>>(url);
    return res.data;
  },

  v1GetEnumStatusList: async () => {
    const url = `${baseEndpoint}/enum-options/status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },

  v1GetEnumType: async () => {
    const url = `${baseEndpoint}/enum-options/type`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },
  v1GetEnumPaymentStatus: async () => {
    const url = `${baseEndpoint}/enum-options/payment-status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },
  v1GetEnumFeedbackStatus: async () => {
    const url = `${baseEndpoint}/enum-options/feed-back-status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },
};
