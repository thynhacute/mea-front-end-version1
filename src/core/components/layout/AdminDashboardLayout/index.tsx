'use client';

import React from 'react';

import { Bank, Cart, Clipboard, HomeAlt1, Person } from 'akar-icons';
import { Layout, Menu } from 'antd';
import { MenuProps } from 'antd/lib';

import { NKRouter } from '@/core/NKRouter';

import DashboardHeader from '../../header/DashboardHeader';

const { Content, Sider } = Layout;

interface DashboardLayoutProps extends React.PropsWithChildren {}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key?: React.Key | null, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Trang Chủ', NKRouter.admin.dashboard(), <HomeAlt1 className="h-[14px] w-[14px]" />),
  getItem('Dash sách kế hoạch mua sắm', NKRouter.admin.plan.list(), <Cart className="h-[14px] w-[14px]" />),
  getItem('Danh sách thiết bị y tế', NKRouter.admin.equipment.list(), <Clipboard className="h-[14px] w-[14px]" />),
  getItem('Danh sách nhân viên', NKRouter.admin.user.list(), <Person className="h-[14px] w-[14px]" />),
  getItem('Danh sách phòng ban', NKRouter.admin.department.list(), <Bank className="h-[14px] w-[14px]" />),
];

const AdminDashboardLayout: React.FunctionComponent<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Layout className="!min-h-screen fade-in min-w-[900px] overflow-auto">
      <DashboardHeader setCollapsed={setCollapsed} />
      <Layout className="">
        <Sider collapsed={collapsed} onCollapse={setCollapsed} className="min-h-[calc(100vh-64px)] relative" width={260}>
          <Menu mode="inline" className="h-full border-r-0" items={items} />
        </Sider>
        <Layout className="">
          <Content className="p-4 m-0 min-h-[280px]">{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardLayout;
