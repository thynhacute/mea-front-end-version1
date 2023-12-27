import { EnumListItem, IPagingDto, ResponseList } from '../models/common';
import { Equipment } from '../models/equipment';
import { equipmentMaintainSchedule } from '../models/equipment-maintain-schedule';
import http from './http';

export interface IV1CreateEquipmentMaintainScheduleDto extends Pick<equipmentMaintainSchedule, 'maintenanceDate' | 'note'> {
  equipmentId: string;
}
const baseEndpoint = '/v1/equipment-maintain-schedule';

export const equipmentMaintainScheduleApi = {
  v1Create: async (dto: IV1CreateEquipmentMaintainScheduleDto) => {
    const url = `${baseEndpoint}`;
    const res = await http.post<Equipment>(url, dto);
    return res.data;
  },
  v1GetByEquipmentId: async (id: string) => {
    const url = `${baseEndpoint}/equipment/${id}`;
    const res = await http.get<equipmentMaintainSchedule[]>(url);
    return res.data;
  },
  v1Delete: async (id: string) => {
    const url = `${baseEndpoint}/${id}`;
    const res = await http.delete(url);
    return res.data;
  },
};
