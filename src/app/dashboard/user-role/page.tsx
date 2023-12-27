'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { userRoleApi } from '@/core/api/user-role.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();

  return (
    <>
      <TableBuilder
        sourceKey="userRole"
        title="Vai Trò"
        queryApi={userRoleApi.v1Get}
        actionColumns={[
          {
            label: 'Xem Chi Tiết',
            onClick: (record) => {
              const id = _get(record, 'id');
              if (id) {
                router.push(NKRouter.user.userRole.detail(id));
              }
            },
          },
        ]}
        columns={[
          {
            key: 'id',
            title: 'ID',
            type: FieldType.UUID,
          },
          {
            key: 'name',
            title: 'Tên',
            type: FieldType.TEXT,
          },
          {
            key: 'createdAt',
            title: 'Ngày Tạo',
            type: FieldType.TIME_FULL,
          },
          {
            key: 'updatedAt',
            title: 'Ngày Cập Nhật',
            type: FieldType.TIME_FULL,
          },
        ]}
        filters={[
          {
            name: 'name',
            label: 'Tên',
            type: NKFormType.TEXT,
            comparator: FilterComparator.LIKE,
            defaultValue: '',
          },
        ]}
      />
    </>
  );
};

export default Page;
