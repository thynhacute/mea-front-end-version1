export enum UserRoleIndex {
  SUPREME = 100,
  SUPER_ADMIN = 20,
  ADMIN = 10,
  MANAGER = 5,
  USER = 1,
}

export interface UserRole {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  name: string;
  index: number;
  isAllowedDelete: boolean;
  isAllowedEdit: boolean;
  isAllowedView: boolean;
  isAllowedCreate: boolean;
  isApproved: boolean;
  source: string;
}
