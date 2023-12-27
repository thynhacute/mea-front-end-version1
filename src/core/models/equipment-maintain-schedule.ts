import { Equipment } from './equipment';

export interface equipmentMaintainSchedule {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  equipment: Equipment;
  maintenanceDate: string;
  isNotified: boolean;
  note: string;
}
