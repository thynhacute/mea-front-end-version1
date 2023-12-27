import { IPagingDto, ResponseList } from '../models/common';
import { UserMeNotification } from '../models/userMeNotification';
import http from './http';

const baseEndpoint = '/v1/user-me-notification';

export interface UserMeNotificationIV1Get extends IPagingDto {}

export const userMeNotificationApi = {
  v1Get: async (dto: UserMeNotificationIV1Get) => {
    const url = `${baseEndpoint}`;
    const res = await http.get<ResponseList<UserMeNotification>>(url, {
      params: { ...dto },
    });
    return res.data;
  },

  v1PutMarkAsRead: async () => {
    const url = `${baseEndpoint}/mark-as-read`;
    const res = await http.put<UserMeNotification[]>(url);
    return res.data;
  },

  v1PutMarkAsReadDetail: async (id: string) => {
    const url = `${baseEndpoint}/mark-as-read-detail/${id}`;
    const res = await http.put<UserMeNotification>(url);
    return res.data;
  },
};
