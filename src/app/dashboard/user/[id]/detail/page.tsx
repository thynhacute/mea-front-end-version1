'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { EditOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'antd';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { departmentApi } from '@/core/api/department.api';
import { userAdminApi } from '@/core/api/user-admin.api';
import { userRoleApi } from '@/core/api/user-role.api';
import { userApi } from '@/core/api/user.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { User } from '@/core/models/user';
import { mapListToOptions } from '@/core/utils/api.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const id = _get(params, 'id') as string;

  const user = useQuery(
    ['user', id],
    () => {
      return userAdminApi.v1GetById(id);
    },
    {},
  );

  return (
    <div className="w-full">
      <FieldBuilder<User>
        fields={[
          {
            label: 'Tên',
            key: 'name',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            label: 'CMND / CCCD',
            key: 'citizenId',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            label: 'ID',
            key: 'id',
            type: FieldType.TEXT,
            span: 1,
          },

          {
            label: 'Email',
            key: 'email',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            label: 'Số Điện Thoại',
            key: 'phone',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            label: 'Giới Tính',
            key: 'gender',
            type: FieldType.BADGE_API,
            span: 1,
            apiAction: userApi.v1GetEnumGender,
          },
          {
            label: 'Ngày Sinh',
            key: 'birthday',
            type: FieldType.TIME_DATE,
            span: 1,
          },

          {
            label: 'Vai Trò',
            key: 'role.id',
            type: FieldType.BADGE_API,
            span: 1,
            apiAction: async () => mapListToOptions(await userRoleApi.v1GetSelect('')),
          },
          {
            label: 'Phòng Ban',
            key: 'department.id',
            type: FieldType.BADGE_API,
            span: 1,
            apiAction: async () => mapListToOptions(await departmentApi.v1GetSelect('')),
          },
          {
            label: 'Ngày Bắt Đầu Làm Việc',
            key: 'startWorkDate',
            type: FieldType.TIME_DATE,
            span: 1,
          },
          {
            label: 'Ngày Tạo',
            key: 'createdAt',
            type: FieldType.TIME_FULL,
            span: 1,
          },
          {
            label: 'Ngày Cập Nhật',
            key: 'updatedAt',
            type: FieldType.TIME_FULL,
            span: 1,
          },
          {
            label: 'Địa Chỉ',
            key: 'address',
            type: FieldType.MULTILINE_TEXT,
            span: 3,
          },

          {
            label: 'Đã Xóa',
            key: 'isDeleted',
            type: FieldType.BOOLEAN,
            span: 1,
          },
          {
            label: 'Trạng Thái',
            key: 'status',
            type: FieldType.BADGE_API,
            apiAction: userApi.v1GetEnumStatus,
            span: 1,
          },
          {
            label: 'Cần Cập Nhật',
            key: 'isRequiredUpdate',
            type: FieldType.BOOLEAN,
            span: 1,
          },
        ]}
        isLoading={user.isLoading}
        record={user.data}
        extra={[
          <Link href={NKRouter.user.user.edit(id)}>
            <Button icon={<EditOutlined rev="" />}>Cập Nhật</Button>
          </Link>,
        ]}
        title="Người Dùng"
      />
    </div>
  );
};

export default Page;
