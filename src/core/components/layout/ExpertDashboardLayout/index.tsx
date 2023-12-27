'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Layout, Menu } from 'antd';

import { useMenuDashboard } from '@/core/contexts/MenuDashboardContext';

import DashboardHeader from '../../header/DashboardHeader';

const { Content, Sider } = Layout;

interface ExpertDashboardLayoutProps extends React.PropsWithChildren {}

const ExpertDashboardLayout: React.FunctionComponent<ExpertDashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { menu } = useMenuDashboard();

  return (
    <Layout className="!min-h-screen fade-in min-w-[900px] overflow-auto">
      <DashboardHeader setCollapsed={setCollapsed} />
      <Layout className="">
        <Sider collapsed={collapsed} onCollapse={setCollapsed} className="min-h-[calc(100vh-64px)] relative">
          <Menu mode="inline" className="h-full border-r-0" items={menu} />
        </Sider>
        <Layout className="">
          <Content className="p-4 m-0 min-h-[280px]">{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ExpertDashboardLayout;
