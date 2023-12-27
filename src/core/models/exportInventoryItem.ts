import { Equipment } from './equipment';
import { Supply } from './supply';

export interface ExportInventoryItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  quantity: number;
  note: string;
  equipment: Equipment;
  supply: Supply;
}
