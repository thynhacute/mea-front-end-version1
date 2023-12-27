export interface RepairProvider {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: false;
  isRequiredUpdate: boolean;
  docStatus: number;
  name: string;
  address: string;
  email: string;
  startWorkDate: string;
  phone: string;
  isExternal: boolean;
  status: string;
}
