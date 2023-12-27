import { User } from './user';

export interface UserMeNotification {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  actionType: string;
  actionId: string;
  content: string;
  title: string;
  status: string;
  sender: User;
}
