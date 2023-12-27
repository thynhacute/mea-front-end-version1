'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import _get from 'lodash/get';

import { userRoleApi } from '@/core/api/user-role.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { UserRole } from '@/core/models/userRole';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const id = _get(params, 'id') as string;

  const userRole = useQuery(
    ['userRole', id],
    () => {
      return userRoleApi.v1GetById(id);
    },
    {},
  );

  return (
    <div className="max-w-3xl">
      <FieldBuilder<UserRole>
        fields={[
          {
            label: 'Tên',
            key: 'name',
            type: FieldType.TEXT,
            span: 2,
          },
          {
            label: 'Trọng Số',
            key: 'index',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            label: 'Quyền Tạo',
            key: 'isAllowedCreate',
            type: FieldType.BOOLEAN,
            span: 1,
          },
          {
            label: 'Quyền Xóa',
            key: 'isAllowedDelete',
            type: FieldType.BOOLEAN,
            span: 2,
          },
          {
            label: 'Quyền Sửa',
            key: 'isAllowedEdit',
            type: FieldType.BOOLEAN,
            span: 1,
          },
          {
            label: 'Quyền Xem',
            key: 'isAllowedView',
            type: FieldType.BOOLEAN,
            span: 2,
          },
          {
            label: 'Quyền Duyệt',
            key: 'isApproved',
            type: FieldType.BOOLEAN,
            span: 3,
          },

          {
            label: 'Ngày Tạo',
            key: 'createdAt',
            type: FieldType.TIME_FULL,
            span: 3,
          },
          {
            label: 'Ngày Cập Nhật',
            key: 'updatedAt',
            type: FieldType.TIME_FULL,
            span: 3,
          },
          {
            label: 'Đã Xóa',
            key: 'isDeleted',
            type: FieldType.BOOLEAN,
            span: 3,
          },
        ]}
        isLoading={userRole.isLoading}
        record={userRole.data}
        title="Vai Trò"
      />
    </div>
  );
};

export default Page;
