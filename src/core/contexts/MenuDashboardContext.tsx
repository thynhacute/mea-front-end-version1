'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { ApartmentOutlined, BellFilled, CodeSandboxOutlined, InsertRowBelowOutlined, TagOutlined, UserOutlined } from '@ant-design/icons';
import { Bell, ClipboardCopy, FileCog, MessageSquare, PackageMinus, PackagePlus, Syringe, Truck, UserCog } from 'lucide-react';
import { useSelector } from 'react-redux';

import { NKRouter } from '../NKRouter';
import { useRole } from '../hooks/useRole';
import { UserRoleIndex } from '../models/userRole';
import { RootState } from '../store';
import { UserState } from '../store/user';

export interface IMenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  children?: IMenuItem[];
}

export interface IMenuDashboardContext {
  menu: IMenuItem[];
}

export const MenuDashboardContext = React.createContext<IMenuDashboardContext>({
  menu: [],
});

interface MenuDashboardProviderProps {
  children: React.ReactNode;
}

export const MenuDashboardProvider: React.FC<MenuDashboardProviderProps> = ({ children }) => {
  const [isDisplayExpert] = useRole(UserRoleIndex.MANAGER, true);
  const { isAdmin, isFacilityManager, isInventoryManager, isMaintenanceManager } = useSelector<RootState, UserState>((state) => state.user);

  const router = useRouter();

  if (isAdmin)
    return (
      <MenuDashboardContext.Provider
        value={{
          menu: [
            {
              key: 'User',
              icon: <UserOutlined rev="" />,
              label: 'Người Dùng',
              children: [
                {
                  key: 'user-list',
                  label: 'Danh Sách',

                  onClick: () => router.push(NKRouter.user.user.list()),
                },
                {
                  key: 'user-role-list',
                  label: 'Vai Trò',

                  onClick: () => router.push(NKRouter.user.userRole.list()),
                },
              ],
            },
            {
              key: 'Brand',
              icon: <TagOutlined rev="" />,
              label: 'Nhãn Hiệu',
              onClick: () => router.push(NKRouter.brand.list()),
            },
            {
              key: 'Equipment',
              icon: <Syringe className="h-[14px] w-[14px]" />,
              label: 'Thiết Bị',
              children: [
                {
                  key: 'equipment-list',
                  label: 'Danh Sách',

                  onClick: () => router.push(NKRouter.equipment.list()),
                },
                {
                  key: 'equipment-category-list',
                  label: 'Danh Mục Thiết Bị',
                  onClick: () => router.push(NKRouter.equipment.category.list()),
                },
              ],
            },
            {
              key: 'Supply',
              icon: <CodeSandboxOutlined rev="" />,
              label: 'Vật Tư',
              children: [
                {
                  key: 'supply-list',
                  label: 'Danh Sách',

                  onClick: () => router.push(NKRouter.supply.list()),
                },
                {
                  key: 'supply-category-list',
                  label: 'Danh Mục Vật Tư',
                  onClick: () => router.push(NKRouter.supply.category.list()),
                },
              ],
            },
            {
              key: 'ImportPlan',
              icon: <ClipboardCopy className="h-[14px] w-[14px]" />,
              label: 'Kế Hoạch Mua Sắm',
              onClick: () => router.push(NKRouter.importPlan.list()),
            },
            {
              key: 'ImportRequest',
              icon: <Truck className="h-[14px] w-[14px]" />,
              label: 'Yêu Cầu Đặt Thiết Bị',
              onClick: () => router.push(NKRouter.importRequest.list()),
            },
            {
              key: 'ExportInventory',
              icon: <PackageMinus className="h-[14px] w-[14px]" />,
              label: 'Xuất Kho',
              onClick: () => router.push(NKRouter.exportInventory.list()),
            },
            {
              key: 'ImportInventory',
              icon: <PackagePlus className="h-[14px] w-[14px]" />,
              label: 'Nhập Kho',
              onClick: () => router.push(NKRouter.importInventory.list()),
            },
            // {
            //     key: 'RepairRequest',
            //     icon: <Wrench className="w-[14px] h-[14px]" />,
            //     label: 'Yêu Cầu Sửa Chữa',
            //     onClick: () => router.push(NKRouter.repairRequest.list()),
            // },
            {
              key: 'RepairReport',
              icon: <FileCog className="w-[14px] h-[14px]" />,
              label: 'Báo Cáo Sửa Chữa',
              onClick: () => router.push(NKRouter.repairReport.list()),
            },
            {
              key: 'RepairProvider',
              icon: <UserCog className="w-[14px] h-[14px]" />,
              label: 'Nhân Viên Kỹ Thuật',
              onClick: () => router.push(NKRouter.repairProvider.list()),
            },
            {
              key: 'Department',
              icon: <ApartmentOutlined rev="" />,
              label: 'Phòng ban',
              onClick: () => router.push(NKRouter.department.list()),
            },
            {
              key: 'Nofication',
              icon: <Bell className="h-[14px] w-[14px]" />,
              label: 'Thông báo',
              onClick: () => router.push(NKRouter.notification.list()),
            },
            {
              key: 'Chat',
              icon: <MessageSquare className="h-[14px] w-[14px]" />,
              label: 'Tin nhắn',
              onClick: () => router.push(NKRouter.chat.main()),
            },
          ] as IMenuItem[],
        }}
      >
        {children}
      </MenuDashboardContext.Provider>
    );

  if (isFacilityManager) {
    return (
      <MenuDashboardContext.Provider
        value={{
          menu: [
            {
              key: 'Equipment',
              icon: <Syringe className="h-[14px] w-[14px]" />,
              label: 'Thiết Bị',
              children: [
                {
                  key: 'equipment-list',
                  label: 'Danh Sách',

                  onClick: () => router.push(NKRouter.equipment.list()),
                },
                {
                  key: 'equipment-category-list',
                  label: 'Danh Mục Thiết Bị',
                  onClick: () => router.push(NKRouter.equipment.category.list()),
                },
              ],
            },
            {
              key: 'Supply',
              icon: <CodeSandboxOutlined rev="" />,
              label: 'Vật Tư',
              children: [
                {
                  key: 'supply-list',
                  label: 'Danh Sách',

                  onClick: () => router.push(NKRouter.supply.list()),
                },
                {
                  key: 'supply-category-list',
                  label: 'Danh Mục Vật Tư',
                  onClick: () => router.push(NKRouter.supply.category.list()),
                },
              ],
            },
            {
              key: 'Brand',
              icon: <TagOutlined rev="" />,
              label: 'Nhãn Hiệu',
              onClick: () => router.push(NKRouter.brand.list()),
            },
            {
              key: 'RepairReport',
              icon: <FileCog className="w-[14px] h-[14px]" />,
              label: 'Báo Cáo Sửa Chữa',
              onClick: () => router.push(NKRouter.repairReport.list()),
            },
            {
              key: 'RepairProvider',
              icon: <UserCog className="w-[14px] h-[14px]" />,
              label: 'Nhân Viên Kỹ Thuật',
              onClick: () => router.push(NKRouter.repairProvider.list()),
            },
            {
              key: 'Department',
              icon: <ApartmentOutlined rev="" />,
              label: 'Phòng ban',
              onClick: () => router.push(NKRouter.department.list()),
            },
            {
              key: 'Nofication',
              icon: <Bell className="h-[14px] w-[14px]" />,
              label: 'Thông báo',
              onClick: () => router.push(NKRouter.notification.list()),
            },
            {
              key: 'Chat',
              icon: <MessageSquare className="h-[14px] w-[14px]" />,
              label: 'Tin nhắn',
              onClick: () => router.push(NKRouter.chat.main()),
            },
            {
              key: 'ImportPlan',
              icon: <ClipboardCopy className="h-[14px] w-[14px]" />,
              label: 'Kế Hoạch Mua Sắm',
              onClick: () => router.push(NKRouter.importPlan.list()),
            },
            {
              key: 'ImportRequest',
              icon: <Truck className="h-[14px] w-[14px]" />,
              label: 'Yêu Cầu Đặt Thiết Bị',
              onClick: () => router.push(NKRouter.importRequest.list()),
            },
            {
              key: 'ExportInventory',
              icon: <PackageMinus className="h-[14px] w-[14px]" />,
              label: 'Xuất Kho',
              onClick: () => router.push(NKRouter.exportInventory.list()),
            },
          ] as IMenuItem[],
        }}
      >
        {children}
      </MenuDashboardContext.Provider>
    );
  }
  if (isInventoryManager) {
    return (
      <MenuDashboardContext.Provider
        value={{
          menu: [
            {
              key: 'Equipment',
              icon: <Syringe className="h-[14px] w-[14px]" />,
              label: 'Thiết Bị',
              children: [
                {
                  key: 'equipment-list',
                  label: 'Danh Sách',

                  onClick: () => router.push(NKRouter.equipment.list()),
                },
                {
                  key: 'equipment-category-list',
                  label: 'Danh Mục Thiết Bị',
                  onClick: () => router.push(NKRouter.equipment.category.list()),
                },
              ],
            },
            {
              key: 'Supply',
              icon: <CodeSandboxOutlined rev="" />,
              label: 'Vật Tư',
              children: [
                {
                  key: 'supply-list',
                  label: 'Danh Sách',

                  onClick: () => router.push(NKRouter.supply.list()),
                },
                {
                  key: 'supply-category-list',
                  label: 'Danh Mục Vật Tư',
                  onClick: () => router.push(NKRouter.supply.category.list()),
                },
              ],
            },
            {
              key: 'Brand',
              icon: <TagOutlined rev="" />,
              label: 'Nhãn Hiệu',
              onClick: () => router.push(NKRouter.brand.list()),
            },
            {
              key: 'Department',
              icon: <ApartmentOutlined rev="" />,
              label: 'Phòng ban',
              onClick: () => router.push(NKRouter.department.list()),
            },
            {
              key: 'Nofication',
              icon: <Bell className="h-[14px] w-[14px]" />,
              label: 'Thông báo',
              onClick: () => router.push(NKRouter.notification.list()),
            },
            {
              key: 'Chat',
              icon: <MessageSquare className="h-[14px] w-[14px]" />,
              label: 'Tin nhắn',
              onClick: () => router.push(NKRouter.chat.main()),
            },
            {
              key: 'ImportPlan',
              icon: <ClipboardCopy className="h-[14px] w-[14px]" />,
              label: 'Kế Hoạch Mua Sắm',
              onClick: () => router.push(NKRouter.importPlan.list()),
            },
            {
              key: 'ImportRequest',
              icon: <Truck className="h-[14px] w-[14px]" />,
              label: 'Yêu Cầu Đặt Thiết Bị',
              onClick: () => router.push(NKRouter.importRequest.list()),
            },
            {
              key: 'ExportInventory',
              icon: <PackageMinus className="h-[14px] w-[14px]" />,
              label: 'Xuất Kho',
              onClick: () => router.push(NKRouter.exportInventory.list()),
            },
            {
              key: 'ImportInventory',
              icon: <PackagePlus className="h-[14px] w-[14px]" />,
              label: 'Nhập Kho',
              onClick: () => router.push(NKRouter.importInventory.list()),
            },
            // {
            //     key: 'RepairRequest',
            //     icon: <Wrench className="w-[14px] h-[14px]" />,
            //     label: 'Yêu Cầu Sửa Chữa',
            //     onClick: () => router.push(NKRouter.repairRequest.list()),
            // },
          ] as IMenuItem[],
        }}
      >
        {children}
      </MenuDashboardContext.Provider>
    );
  }
  if (isMaintenanceManager) {
    return (
      <MenuDashboardContext.Provider
        value={{
          menu: [
            {
              key: 'Equipment',
              icon: <Syringe className="h-[14px] w-[14px]" />,
              label: 'Thiết Bị',
              children: [
                {
                  key: 'equipment-list',
                  label: 'Danh Sách',

                  onClick: () => router.push(NKRouter.equipment.list()),
                },
                {
                  key: 'equipment-category-list',
                  label: 'Danh Mục Thiết Bị',
                  onClick: () => router.push(NKRouter.equipment.category.list()),
                },
              ],
            },
            {
              key: 'Supply',
              icon: <CodeSandboxOutlined rev="" />,
              label: 'Vật Tư',
              children: [
                {
                  key: 'supply-list',
                  label: 'Danh Sách',

                  onClick: () => router.push(NKRouter.supply.list()),
                },
                {
                  key: 'supply-category-list',
                  label: 'Danh Mục Vật Tư',
                  onClick: () => router.push(NKRouter.supply.category.list()),
                },
              ],
            },

            {
              key: 'RepairReport',
              icon: <FileCog className="w-[14px] h-[14px]" />,
              label: 'Báo Cáo Sửa Chữa',
              onClick: () => router.push(NKRouter.repairReport.list()),
            },
            {
              key: 'RepairProvider',
              icon: <UserCog className="w-[14px] h-[14px]" />,
              label: 'Nhân Viên Kỹ Thuật',
              onClick: () => router.push(NKRouter.repairProvider.list()),
            },
            {
              key: 'Department',
              icon: <ApartmentOutlined rev="" />,
              label: 'Phòng ban',
              onClick: () => router.push(NKRouter.department.list()),
            },
            {
              key: 'Nofication',
              icon: <Bell className="h-[14px] w-[14px]" />,
              label: 'Thông báo',
              onClick: () => router.push(NKRouter.notification.list()),
            },
            {
              key: 'Chat',
              icon: <MessageSquare className="h-[14px] w-[14px]" />,
              label: 'Tin nhắn',
              onClick: () => router.push(NKRouter.chat.main()),
            },
          ] as IMenuItem[],
        }}
      >
        {children}
      </MenuDashboardContext.Provider>
    );
  }
  return (
    <MenuDashboardContext.Provider
      value={{
        menu: [
          {
            key: 'User',
            icon: <UserOutlined rev="" />,
            label: 'Người Dùng',
            children: [
              {
                key: 'user-list',
                label: 'Danh Sách',

                onClick: () => router.push(NKRouter.user.user.list()),
              },
              {
                key: 'user-role-list',
                label: 'Vai Trò',

                onClick: () => router.push(NKRouter.user.userRole.list()),
              },
            ],
          },
          {
            key: 'Brand',
            icon: <TagOutlined rev="" />,
            label: 'Nhãn Hiệu',
            onClick: () => router.push(NKRouter.brand.list()),
          },
          {
            key: 'Equipment',
            icon: <Syringe className="h-[14px] w-[14px]" />,
            label: 'Thiết Bị',
            children: [
              {
                key: 'equipment-list',
                label: 'Danh Sách',

                onClick: () => router.push(NKRouter.equipment.list()),
              },
              {
                key: 'equipment-category-list',
                label: 'Danh Mục Thiết Bị',
                onClick: () => router.push(NKRouter.equipment.category.list()),
              },
            ],
          },
          {
            key: 'Supply',
            icon: <CodeSandboxOutlined rev="" />,
            label: 'Vật Tư',
            children: [
              {
                key: 'supply-list',
                label: 'Danh Sách',

                onClick: () => router.push(NKRouter.supply.list()),
              },
              {
                key: 'supply-category-list',
                label: 'Danh Mục Vật Tư',
                onClick: () => router.push(NKRouter.supply.category.list()),
              },
            ],
          },
          {
            key: 'ImportPlan',
            icon: <ClipboardCopy className="h-[14px] w-[14px]" />,
            label: 'Kế Hoạch Mua Sắm',
            onClick: () => router.push(NKRouter.importPlan.list()),
          },
          {
            key: 'ImportRequest',
            icon: <Truck className="h-[14px] w-[14px]" />,
            label: 'Yêu Cầu Đặt Thiết Bị',
            onClick: () => router.push(NKRouter.importRequest.list()),
          },
          {
            key: 'ExportInventory',
            icon: <PackageMinus className="h-[14px] w-[14px]" />,
            label: 'Xuất Kho',
            onClick: () => router.push(NKRouter.exportInventory.list()),
          },
          {
            key: 'ImportInventory',
            icon: <PackagePlus className="h-[14px] w-[14px]" />,
            label: 'Nhập Kho',
            onClick: () => router.push(NKRouter.importInventory.list()),
          },
          // {
          //     key: 'RepairRequest',
          //     icon: <Wrench className="w-[14px] h-[14px]" />,
          //     label: 'Yêu Cầu Sửa Chữa',
          //     onClick: () => router.push(NKRouter.repairRequest.list()),
          // },
          {
            key: 'RepairReport',
            icon: <FileCog className="w-[14px] h-[14px]" />,
            label: 'Báo Cáo Sửa Chữa',
            onClick: () => router.push(NKRouter.repairReport.list()),
          },
          {
            key: 'RepairProvider',
            icon: <UserCog className="w-[14px] h-[14px]" />,
            label: 'Nhân Viên Kỹ Thuật',
            onClick: () => router.push(NKRouter.repairProvider.list()),
          },
          {
            key: 'Department',
            icon: <ApartmentOutlined rev="" />,
            label: 'Phòng ban',
            onClick: () => router.push(NKRouter.department.list()),
          },
          {
            key: 'Nofication',
            icon: <Bell className="h-[14px] w-[14px]" />,
            label: 'Thông báo',
            onClick: () => router.push(NKRouter.notification.list()),
          },
          {
            key: 'Chat',
            icon: <MessageSquare className="h-[14px] w-[14px]" />,
            label: 'Tin nhắn',
            onClick: () => router.push(NKRouter.chat.main()),
          },
        ] as IMenuItem[],
      }}
    >
      {children}
    </MenuDashboardContext.Provider>
  );
};

export const useMenuDashboard = () => React.useContext(MenuDashboardContext);
