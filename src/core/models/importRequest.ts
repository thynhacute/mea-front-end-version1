import { Department } from './department';
import { ExportInventory } from './exportInventory';
import { ImportRequestItem } from './importRequestItem';
import { User } from './user';

export interface ImportRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: false;
  isRequiredUpdate: boolean;
  docStatus: number;
  name: string;
  description: string;
  status: string;
  note: string;
  expected: string;
  createdBy: User;
  updatedBy: User;
  importRequestItems: ImportRequestItem[];
  department: Department;
  exportInventories: ExportInventory[];
  isDone: boolean;
  approveQuantity: number;
}
