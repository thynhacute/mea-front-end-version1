import { User } from './user';

export interface Department {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  name: string;
  description: string;
  status: string;
  users: User[];
}
