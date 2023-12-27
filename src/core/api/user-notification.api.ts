import { EnumListItem } from '../models/common';
import { UserMeNotification } from '../models/userMeNotification';
import http from './http';

interface UserNotificationIV1CreateDto extends Pick<UserMeNotification, 'actionId' | 'actionType' | 'content' | 'title'> {
  senderId: string;
  receiverId: string[];
}
const baseEndpoint = '/v1/user-notification';

export const userNotificationApi = {
  v1GetEnumStatus: async () => {
    const url = `${baseEndpoint}/enum-options/status`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },

  v1GetEnumActionType: async () => {
    const url = `${baseEndpoint}/enum-options/action-type`;
    const res = await http.get<EnumListItem[]>(url);
    return res.data;
  },

  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete<boolean>(url);
    return res.data;
  },

  v1Post: async (dto: UserNotificationIV1CreateDto) => {
    const url = `${baseEndpoint}/send`;
    const res = await http.post<UserMeNotification>(url, dto);
    return res.data;
  },
};
