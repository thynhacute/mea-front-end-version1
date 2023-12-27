'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { departmentApi } from '@/core/api/department.api';
import { UserIV1Update, userAdminApi } from '@/core/api/user-admin.api';
import { userRoleApi } from '@/core/api/user-role.api';
import { userApi } from '@/core/api/user.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const id = _get(params, 'id') as string;
  const router = useRouter();

  const user = useQuery(
    ['user', id],
    () => {
      return userAdminApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <FormBuilder<UserIV1Update>
        fields={[
          {
            label: 'Tên',
            name: 'name',
            type: NKFormType.TEXT,
            span: 3,
          },
          {
            label: 'Ngày Sinh',
            name: 'birthday',
            type: NKFormType.DATE,
            span: 3,
          },
          {
            label: 'Số Điện Thoại',
            name: 'phone',
            type: NKFormType.TEXT,
            span: 3,
          },
          {
            label: 'CMND / CCCD',
            name: 'citizenId',
            type: NKFormType.TEXT,
            span: 3,
          },
          {
            label: 'Ngày Bắt Đầu Làm Việc',
            name: 'startWorkDate',
            type: NKFormType.DATE,
            span: 3,
          },
          {
            label: 'Giới Tính',
            name: 'gender',
            type: NKFormType.SELECT_API_OPTION,
            useAction: userApi.v1GetEnumGender,
            span: 3,
          },
          {
            label: 'Trạng Thái',
            name: 'status',
            type: NKFormType.SELECT_API_OPTION,
            useAction: userApi.v1GetEnumStatus,
            span: 3,
          },
          {
            label: 'Phòng Ban',
            name: 'departmentId',
            type: NKFormType.SELECT_API_OPTION,
            useAction: departmentApi.v1GetSelect,
            span: 3,
          },
          {
            label: 'Vai Trò',
            name: 'roleId',
            type: NKFormType.SELECT_API_OPTION,
            useAction: userRoleApi.v1GetSelect,
            span: 3,
          },
          {
            label: 'Địa Chỉ',
            name: 'address',
            type: NKFormType.TEXTAREA,
            span: 3,
          },
        ]}
        apiAction={(data) => {
          return userAdminApi.v1Update(id, data);
        }}
        onExtraSuccessAction={() => {
          router.push(NKRouter.user.user.detail(id));
        }}
        defaultValues={{
          name: user.data?.name || '',
          address: user.data?.address || '',
          birthday: user.data?.birthday || '',
          phone: user.data?.phone || '',
          citizenId: user.data?.citizenId || '',
          departmentId: user.data?.department?.id || '',
          gender: user.data?.gender || '',
          roleId: user.data?.role?.id || '',
          status: user.data?.status || '',
          startWorkDate: user.data?.startWorkDate || '',
          password: '',
        }}
        title="Chỉnh Sửa Thông Tin Người Dùng"
        btnLabel="Cập nhật"
      />
    </div>
  );
};

export default Page;
