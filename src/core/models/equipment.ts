import { Brand } from './brand';
import { Department } from './department';
import { EquipmentCategory } from './equipmentCategory';
import { EquipmentStatus } from './equipmentStatus';

export interface Equipment {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  name: string;
  code: string;
  description: string;
  mfDate: string;
  importDate: string;
  endOfWarrantyDate: string;
  imageUrls: string[];
  equipmentCategory: EquipmentCategory;
  equipmentStatus: EquipmentStatus[];
  department: Department;
  brand: Brand;
  currentStatus: string;
}
