export interface EquipmentStatus {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: false;
  isRequiredUpdate: boolean;
  docStatus: number;
  lastStatus: string;
  currentStatus: string;
  note: string;
}
