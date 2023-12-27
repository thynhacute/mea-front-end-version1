import { Equipment } from './equipment';
import { RepairProvider } from './repairProvider';
import { Supply } from './supply';

export interface RepairReportItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  description: string;
  name: string;
  type: string;
  paymentStatus: string;
  price: number;
  status: string;
  imageUrls: string[];
  equipment: Equipment;
  repairProviders: RepairProvider[];
  repairReplaceItems: RepairReplaceItem[];
}

export interface RepairReplaceItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  quantity: number;
  supply: Supply;
}
