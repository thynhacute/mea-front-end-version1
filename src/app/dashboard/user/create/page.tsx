'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { EditOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'antd';
import Joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { departmentApi } from '@/core/api/department.api';
import { UserIV1Create, UserIV1Update, userAdminApi } from '@/core/api/user-admin.api';
import { userRoleApi } from '@/core/api/user-role.api';
import { userApi } from '@/core/api/user.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { User } from '@/core/models/user';
import { mapListToOptions } from '@/core/utils/api.helper';

// export interface UserIV1Update extends Pick<User, 'name' | 'address' | 'birthday' | 'phone' | 'citizenId' | 'gender' | 'status'> {
//     departmentId: string;
//     roleId: string;
// }

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="max-w-2xl">
      <FormBuilder<UserIV1Create>
        fields={[
          {
            label: 'Username',
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
        ]}
        apiAction={userAdminApi.v1Create}
        defaultValues={{
          departmentId: '',
          roleId: '',
          password: '',
          startWorkDate: new Date().toISOString(),
          username: '',
        }}
        onExtraSuccessAction={() => {
          router.push(NKRouter.user.user.list());
        }}
        title="Tạo mới người dùng"
      />
    </div>
  );
};

export default Page;
