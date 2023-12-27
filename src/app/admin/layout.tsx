import DashboardLayout from '@/core/components/layout/DashboardLayout';
import AuthWrapper from '@/core/components/wrapper/AuthWrapper';
import RoleWrapper from '@/core/components/wrapper/RoleWrapper';
import { UserRoleIndex } from '@/core/models/userRole';

export default function RootLayout({ children, params: { locale } }: { children: React.ReactNode; params: Record<string, any> }) {
  return (
    <AuthWrapper>
      <DashboardLayout>
        <RoleWrapper userRoleIndex={UserRoleIndex.ADMIN}>{children}</RoleWrapper>
      </DashboardLayout>
    </AuthWrapper>
  );
}
