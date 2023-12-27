import { Single } from '../models/single';
import http from './http';

export interface SingleIV1UpdateDto extends Pick<Single, 'value'> {}

export const singleApi = {
  v1GetByScopeAndName: async (scope: string, name: string) => {
    const url = `/v1/single/${scope}/${name}`;
    const res = await http.get<Single>(url);
    return res.data;
  },
  v1Put: async (id: string, dto: SingleIV1UpdateDto) => {
    const url = `/v1/single/${id}`;
    const res = await http.put<Single>(url, dto);
    return res.data;
  },
};
