import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ListSkeleton } from '@ant-design/pro-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Bell, DragVerticalFill } from 'akar-icons';
import { Button, Card, Dropdown, Empty, Pagination, Popover, Typography } from 'antd';
import _get from 'lodash/get';
import { MenuIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import Cookies from 'universal-cookie';

import { NKConstant } from '@/core/NKConstant';
import { NKRouter } from '@/core/NKRouter';
import { userMeNotificationApi } from '@/core/api/user-me-notification';
import { userMeApi } from '@/core/api/user-me.api';
import { useRole } from '@/core/hooks/useRole';
import { SortOrder } from '@/core/models/common';
import { UserRoleIndex } from '@/core/models/userRole';
import { RootState, store } from '@/core/store';
import { UserState, userActions } from '@/core/store/user';
import { nkMoment } from '@/core/utils/moment';

import ScrollInfinityBuilder from '../scroll/ScrollInfinityBuilder';

interface DashboardHeaderProps {
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ setCollapsed }) => {
  const router = useRouter();
  const [isDisplayExpert] = useRole(UserRoleIndex.MANAGER, true);
  const userStore = useSelector<RootState, UserState>((state) => state.user);
  const [count, setCount] = React.useState(0);

  const logoutMutation = useMutation(
    () => {
      return userMeApi.v1PostLogout();
    },
    {
      onSuccess: () => {
        store.dispatch(userActions.resetState());
        const cookies = new Cookies();

        cookies.remove(NKConstant.TOKEN_COOKIE_KEY, { path: '/' });
        cookies.remove(NKConstant.TOKEN_COOKIE_KEY, { path: '/' });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
    },
  );

  const [page, setPage] = React.useState(0);

  const userMeNotificationQuery = useQuery(['user-me-notification', page], async () => {
    const res = await userMeNotificationApi.v1Get({
      filters: [],
      orderBy: [`${'createdAt'}||${SortOrder.DESC}`],
      page: page,
      pageSize: 10,
    });

    const countUnread = _get(res, 'countUnread', 0);
    setCount(countUnread);

    return res;
  });

  const markAsReadDetailMutation = useMutation(
    async (id: string) => {
      return userMeNotificationApi.v1PutMarkAsReadDetail(id);
    },
    {
      onSuccess: () => {
        userMeNotificationQuery.refetch();
      },
    },
  );

  const markAsReadMutation = useMutation(
    async () => {
      return userMeNotificationApi.v1PutMarkAsRead();
    },
    {
      onSuccess: () => {
        userMeNotificationQuery.refetch();
      },
    },
  );

  return (
    <div className="z-10 flex items-center justify-between h-16 gap-2 p-4 bg-white border border-black shadow-md">
      <div className="flex items-center gap-2 ">
        <Link href={isDisplayExpert ? NKRouter.expert.chart.list() : NKRouter.dashboard()}>
          <div className="flex items-center h-6 gap-2">
            <div className="h-full shrink-0 ">
              <img src="/assets/images/logo.png" alt={NKConstant.APP_NAME} className="w-16 h-full lg:w-full " />
            </div>
            <div className="font-semibold text-black">{NKConstant.APP_NAME}</div>
          </div>
        </Link>
        {isDisplayExpert ? (
          <>
            <div className="flex items-center gap-4 ml-8">
              <Button
                type="primary"
                onClick={() => {
                  setCollapsed((pre) => !pre);
                }}
                size="small"
                icon={<MenuIcon className="w-5 h-5 text-white" />}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4 ml-8 ">
              <Button
                type="primary"
                onClick={() => {
                  setCollapsed((pre) => !pre);
                }}
                size="small"
                icon={<MenuIcon className="w-5 h-5 " color="white" />}
              />
              <Button
                type="primary"
                onClick={() => {
                  router.push(NKRouter.menu.list());
                }}
                className="flex items-center justify-center"
                size="small"
                icon={<DragVerticalFill strokeWidth={3} size={20} color="white" className="w-5 h-5 " />}
              />
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Popover
          trigger={'click'}
          content={
            <div>
              <ScrollInfinityBuilder
                sourceKey="notification"
                queryApi={userMeNotificationApi.v1Get}
                pageSize={6}
                className="w-[360px] !h-96 overflow-auto"
                render={(item, index) => (
                  <div className="mb-4">
                    <div
                      onClick={() => {
                        markAsReadDetailMutation.mutate(item.id);
                        switch (item.actionType) {
                          case 'REPAIR_REPORT_LINK':
                            router.push(NKRouter.repairReport.detail(item.actionId));
                            break;
                          case 'IMPORT_PLAN_LINK':
                            router.push(NKRouter.importPlan.detail(item.actionId));
                            break;
                          case 'IMPORT_REQUEST_LINK':
                            router.push(NKRouter.importRequest.detail(item.actionId));
                            break;
                          case 'EXPORT_INVENTORY_LINK':
                            router.push(NKRouter.exportInventory.detail(item.actionId));
                            break;
                        }
                      }}
                      className="relative flex flex-col w-full gap-4 px-4 py-3 border border-gray-200 border-solid rounded cursor-pointer"
                      key={item.id}
                    >
                      <p className="m-0 text-base text-gray-900 line-clamp-1">
                        <span className="font-semibold">{item.title}</span> - <span>{item.content}</span>
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="pr-4 m-0 text-xs text-gray-600">{nkMoment(item.createdAt).format('DD/MM/YYYY HH:mm')}</p>

                        {!Boolean(item.status === 'READ_DETAIL') && <div className="  w-2.5 h-2.5  bg-blue-400 rounded-full " />}
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
            // <Card bordered={false}>
            //   <div className="w-[360px]">
            //     {userMeNotificationQuery.isLoading ? (
            //       <ListSkeleton size={8} />
            //     ) : (
            //       <>
            //         {Boolean(userMeNotificationQuery.data?.count) ? (
            //           <div className="flex flex-col w-full gap-1">
            //             {userMeNotificationQuery.data?.data.map((item) => (
            //               <div
            //                 onClick={() => {
            //                   markAsReadDetailMutation.mutate(item.id);
            //                   switch (item.actionType) {
            //                     case 'REPAIR_REPORT_LINK':
            //                       router.push(NKRouter.repairReport.detail(item.actionId));
            //                       break;
            //                     case 'IMPORT_PLAN_LINK':
            //                       router.push(NKRouter.importPlan.detail(item.actionId));
            //                       break;
            //                     case 'IMPORT_REQUEST_LINK':
            //                       router.push(NKRouter.importRequest.detail(item.actionId));
            //                       break;
            //                     case 'EXPORT_INVENTORY_LINK':
            //                       router.push(NKRouter.exportInventory.detail(item.actionId));
            //                       break;
            //                   }
            //                 }}
            //                 className="relative flex flex-col w-full gap-1 px-4 py-3 border border-gray-200 border-solid rounded cursor-pointer"
            //                 key={item.id}
            //               >
            //                 <p className="m-0 text-base text-gray-900 line-clamp-1">
            //                   <span className="font-semibold">{item.title}</span> - <span>{item.content}</span>
            //                 </p>
            //                 <p className="m-0 text-xs text-gray-600">{moment(item.createdAt).format('HH:mm')}</p>
            //                 {!Boolean(item.status === 'READ_DETAIL') && (
            //                   <div className="absolute w-2.5 h-2.5 -translate-y-1/2 bg-blue-400 rounded-full right-4 top-1/2" />
            //                 )}
            //               </div>
            //             ))}
            //             <div className="flex items-center justify-between w-full mt-2">
            //               <Pagination
            //                 size="small"
            //                 total={userMeNotificationQuery.data?.count}
            //                 onChange={(page) => {
            //                   setPage(page - 1);
            //                 }}
            //               />
            //               <Link href={NKRouter.notification.list()} className="text-sm font-medium text-blue-400">
            //                 <span>Xem tất cả</span>
            //               </Link>
            //             </div>
            //           </div>
            //         ) : (
            //           <Empty />
            //         )}
            //       </>
            //     )}
            //   </div>
            // </Card>
          }
        >
          <div className="relative w-5 h-5" onClick={() => markAsReadMutation.mutate()}>
            <div className="absolute top-0 flex items-center justify-center w-4 h-4 text-xs font-medium text-white -translate-y-1/2 bg-red-500 rounded-full -right-2">
              {count}
            </div>
            <Bell size={20} />
          </div>
        </Popover>
        <Dropdown
          menu={{
            items: [
              {
                type: 'item',
                label: 'Hồ Sơ Cá Nhân',
                key: 'profile',
                onClick: () => {
                  router.push(NKRouter.account.profile());
                },
              },
              {
                type: 'item',
                label: 'Cập Nhật Thông Tin',
                key: 'update-profile',
                onClick: () => {
                  router.push(NKRouter.account.updateProfile());
                },
              },
              {
                type: 'item',
                label: 'Đổi Mật Khẩu',
                key: 'change-password',
                onClick: () => {
                  router.push(NKRouter.account.changePassword());
                },
              },

              {
                type: 'item',
                label: 'Đăng Xuất',
                key: 'logout',
                onClick: () => {
                  logoutMutation.mutate();
                },
              },
            ] as any,
          }}
        >
          <Typography>
            Xin Chào, <span className="font-semibold">{userStore.name}</span>
          </Typography>
        </Dropdown>
      </div>
    </div>
  );
};

export default DashboardHeader;
