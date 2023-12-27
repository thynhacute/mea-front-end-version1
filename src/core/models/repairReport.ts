import { RepairReportItem } from './repairReportItem';
import { User } from './user';

export interface RepairReport {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isRequiredUpdate: boolean;
  docStatus: number;
  status: string;
  description: string;
  note: string;
  startAt: string;
  endAt: string;
  createdBy: User;
  updatedBy: User;
  repairReportItems: RepairReportItem[];
  price: number;
  importRequestId: string;
  brokenDate: string | null;
}
