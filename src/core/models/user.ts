import { Department } from './department';
import { UserRole } from './userRole';

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: false;
  isRequiredUpdate: boolean;
  docStatus: number;
  name: string;
  password: string;
  email: string;
  username: string;
  phone: string;
  birthday: string;
  startWorkDate: string;
  address: string;
  citizenId: string;
  gender: string;
  googleId: string;
  status: string;
  role: UserRole;
  department: Department;
}
