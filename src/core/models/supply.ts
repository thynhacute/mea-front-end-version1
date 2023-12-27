import { Brand } from './brand';
import { EquipmentCategory } from './equipmentCategory';
import { SupplyCategory } from './supplyCategory';

export interface Supply {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  name: string;
  status: string;
  unit: string;
  code: string;
  description: string;
  quantity: number;
  imageUrls: string[];
  brand: Brand;
  supplyCategory: SupplyCategory;
  equipmentCategory: EquipmentCategory;
}
