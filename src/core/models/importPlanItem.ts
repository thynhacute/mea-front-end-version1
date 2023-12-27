export interface ImportPlanItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  name: string;
  code: string;
  machine: string;
  category: string;
  brand: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  contact: string;
}
