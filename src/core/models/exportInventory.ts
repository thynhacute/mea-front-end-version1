import { Department } from './department';
import { ExportInventoryItem } from './exportInventoryItem';
import { ImportRequest } from './importRequest';
import { User } from './user';

export interface ExportInventory {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  exportDate: string;
  documentNumber: string;
  contractSymbol: string;
  code: string;
  status: string;
  note: string;
  createdBy: User;
  updatedBy: User;
  importRequest: ImportRequest;
  department: Department;
  slug: string;
  exportInventoryItems: ExportInventoryItem[];
}
