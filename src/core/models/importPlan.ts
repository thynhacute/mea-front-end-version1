import { ImportInventory } from './importInventory';
import { ImportPlanItem } from './importPlanItem';
import { User } from './user';

export interface ImportPlan {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: false;
  isRequiredUpdate: boolean;
  docStatus: number;
  name: string;
  startImportDate: string;
  endImportDate: string;
  documentNumber: string;
  contractSymbol: string;
  code: string;
  status: string;
  createdBy: User;
  updatedBy: User;
  importPlanItems: ImportPlanItem[];
  importInventories: ImportInventory[];
  note: string;
}
