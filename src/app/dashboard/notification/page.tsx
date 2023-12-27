'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import _get from 'lodash.get';

import { NKRouter } from '@/core/NKRouter';
import { userMeNotificationApi } from '@/core/api/user-me-notification';
import { userNotificationApi } from '@/core/api/user-notification.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const markAsReadDetailMutation = useMutation(
    async (id: string) => {
      return userMeNotificationApi.v1PutMarkAsReadDetail(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    },
  );

  return (
    <>
      <TableBuilder
        sourceKey="notification"
        title="Thông báo"
        queryApi={userMeNotificationApi.v1Get}
        actionColumns={[
          {
            label: 'Dánh dấu đã đọc chi tiết',
            onClick: (record) => {
              const id = _get(record, 'id');
              markAsReadDetailMutation.mutate(id);
            },
          },
          {
            label: 'Xem chi tiết',
            onClick: (item) => {
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
            },
          },
        ]}
        columns={[
          {
            key: 'title',
            title: 'Tiêu đề',
            type: FieldType.TEXT,
          },
          {
            key: 'content',
            title: 'Nội dung',
            type: FieldType.TEXT,
          },
          {
            key: 'status',
            title: 'Trạng thái',
            type: FieldType.BADGE_API,
            apiAction: userNotificationApi.v1GetEnumStatus,
          },
          {
            key: 'createdAt',
            title: 'Ngày tạo',
            type: FieldType.TIME_FULL,
          },
          {
            key: 'updatedAt',
            title: 'Ngày cập nhật',
            type: FieldType.TIME_FULL,
          },
        ]}
        filters={[
          {
            name: 'title',
            label: 'Tiêu đề',
            type: NKFormType.TEXT,
            comparator: FilterComparator.LIKE,
            defaultValue: '',
          },
          {
            name: 'content',
            label: 'Nội dung',
            type: NKFormType.TEXT,
            comparator: FilterComparator.LIKE,
            defaultValue: '',
          },
          {
            name: 'status',
            label: 'Trạng thái',
            type: NKFormType.SELECT_API_OPTION,
            apiAction: userNotificationApi.v1GetEnumStatus,
            comparator: FilterComparator.LIKE,
            defaultValue: '',
          },
        ]}
      />
    </>
  );
};

export default Page;
