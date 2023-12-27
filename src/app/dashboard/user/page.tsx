'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { departmentApi } from '@/core/api/department.api';
import { UserIV1Create, userAdminApi } from '@/core/api/user-admin.api';
import { userRoleApi } from '@/core/api/user-role.api';
import { userApi } from '@/core/api/user.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';
import { addNoSelectOption, mapListToOptions } from '@/core/utils/api.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();

  return (
    <>
      <TableBuilder
        sourceKey="userRole"
        title="Quản Lý Người Dùng"
        queryApi={userAdminApi.v1Get}
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
            key: 'status',
            title: 'Trạng Thái',
            type: FieldType.BADGE_API,
            apiAction: userApi.v1GetEnumStatus,
          },

          {
            key: 'role.id',
            title: 'Vai Trò',
            type: FieldType.BADGE_API,
            apiAction: async () => mapListToOptions(await userRoleApi.v1GetSelect('')),
          },
          {
            key: 'department.id',
            title: 'Phòng Ban',
            type: FieldType.BADGE_API,
            apiAction: async () => mapListToOptions(await departmentApi.v1GetSelect('')),
          },
          {
            key: 'createdAt',
            title: 'Ngày Tạo',
            type: FieldType.TIME_DATE,
          },
        ]}
        extraButtons={[
          <div key="5">
            <ModalBuilder
              btnLabel="Tạo Mới"
              modalTitle=""
              btnProps={{
                icon: <PlusOutlined rev="" />,
                type: 'primary',
              }}
            >
              {(close) => (
                <FormBuilder<UserIV1Create>
                  fields={[
                    {
                      label: 'Tên tài khoản',
                      name: 'username',
                      type: NKFormType.TEXT,
                      span: 3,
                    },
                    {
                      label: 'Mật khẩu',
                      name: 'password',
                      type: NKFormType.TEXT,
                      span: 3,
                    },
                    {
                      label: 'Ngày bắt đầu làm việc',
                      name: 'startWorkDate',
                      type: NKFormType.DATE,
                      span: 3,
                    },
                    {
                      label: 'Phòng Ban',
                      name: 'departmentId',
                      type: NKFormType.SELECT_API_OPTION,
                      useAction: async (search) => {
                        const res = await departmentApi.v1GetSelect(search);

                        return addNoSelectOption(
                          res.map((item) => ({ name: item.name, value: item.id, label: item.name, color: item.name, id: item.id, slug: item.id })),
                        );
                      },
                      span: 3,
                    },
                    {
                      label: 'Vai Trò',
                      name: 'roleId',
                      type: NKFormType.SELECT_API_OPTION,
                      useAction: userRoleApi.v1GetSelect,
                      span: 3,
                    },
                  ]}
                  apiAction={userAdminApi.v1Create}
                  defaultValues={{
                    departmentId: '',
                    roleId: '',
                    password: '',
                    startWorkDate: new Date().toISOString(),
                    username: '',
                  }}
                  onExtraSuccessAction={(data) => {
                    const id = _get(data, 'id');
                    router.push(NKRouter.user.user.detail(id));
                    close();
                  }}
                  btnLabel="Đồng ý"
                  title="Tạo mới người dùng"
                />
              )}
            </ModalBuilder>
          </div>,
        ]}
        actionColumns={[
          {
            label: 'Xem Chi Tiết',
            onClick: (record) => {
              const id = _get(record, 'id');
              if (id) {
                router.push(NKRouter.user.user.detail(id));
              }
            },
          },
          {
            label: 'Chỉnh Sửa',
            onClick: (record) => {
              const id = _get(record, 'id');
              if (id) {
                router.push(NKRouter.user.user.edit(id));
              }
            },
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

          {
            name: 'role.id',
            label: 'Vai Trò',
            type: NKFormType.SELECT_API_OPTION,
            comparator: FilterComparator.EQUAL,
            apiAction: async (data) => mapListToOptions(await userRoleApi.v1GetSelect(data)),
          },
          {
            name: 'department.id',
            label: 'Phòng Ban',
            type: NKFormType.SELECT_API_OPTION,
            comparator: FilterComparator.EQUAL,
            apiAction: async (data) => mapListToOptions(await departmentApi.v1GetSelect(data)),
          },
        ]}
      />
    </>
  );
};

export default Page;
