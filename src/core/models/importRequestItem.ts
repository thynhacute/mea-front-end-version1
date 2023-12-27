import { Equipment } from './equipment';
import { Supply } from './supply';

export interface ImportRequestItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  quantity: number;
  equipment: Equipment;
  supply: Supply;
  code: string;
  approveQuantity: number;
}
