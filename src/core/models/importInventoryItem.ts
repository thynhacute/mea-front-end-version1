import { Equipment } from './equipment';
import { Supply } from './supply';

export interface ImportInventoryItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  quantity: number;
  note: string;
  price: number;
  mfDate: string;
  expiredDate: string;
  endOfWarrantyDate: string;
  equipment: Equipment;
  supply: Supply;
}
