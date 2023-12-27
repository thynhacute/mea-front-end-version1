import { EnumListItem } from '../models/common';
import http from './http';

export const equipmentStatusApi = {
  v1GetEnumStatus: async () => {
    const url = '/v1/equipment-status/enum-options/status';
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },
};
