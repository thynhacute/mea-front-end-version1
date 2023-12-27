import { Department } from './department';
import { Equipment } from './equipment';
import { User } from './user';

export interface RepairRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  description: string;
  imageUrls: string[];
  status: string;
  note: string;
  createdBy: User;
  updatedBy: User;
  equipment: Equipment;
}
