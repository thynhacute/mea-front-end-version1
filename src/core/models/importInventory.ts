import { ImportInventoryItem } from './importInventoryItem';
import { ImportPlan } from './importPlan';
import { User } from './user';

export interface ImportInventory {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  name: string;
  note: string;
  status: string;
  documentNumber: string;
  contractSymbol: string;
  code: string;
  importDate: string;
  createdBy: User;
  updatedBy: User;
  importPlan: ImportPlan;
  importInventoryItems: ImportInventoryItem[];
}
