import { UserRole } from '@/core/models/userRole';

export interface ApiState {
  isLoading: boolean;
  errorDetails: Record<string, string>;
  isError: boolean;
  message: string;
  errorMessage: string;
  roles: UserRole[];
}
