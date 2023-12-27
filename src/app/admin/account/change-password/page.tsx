'use client';

import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import joi from 'joi';

import { IV1ChangePasswordDto, IV1UpdateProfileDto, userMeApi } from '@/core/api/user-me.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';

interface ResetPasswordForm extends IV1ChangePasswordDto {
  confirmPassword: string;
}

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const userMeQuery = useQuery(['userMe'], () => {
    return userMeApi.v1Get();
  });

  return (
    <div className="flex gap-10">
      <div className="w-full max-w-md">
        <FormBuilder<ResetPasswordForm>
          apiAction={userMeApi.v1PutChangePassword}
          schema={{
            newPassword: joi.string().required(),
            password: joi.string().required(),
            confirmPassword: joi.string().required().valid(joi.ref('newPassword')),
          }}
          isDebug
          fields={[
            {
              label: 'Mật khẩu cũ',
              name: 'password',
              type: NKFormType.PASSWORD,
              span: 3,
            },
            {
              label: 'Mật khẩu mới',
              name: 'newPassword',
              type: NKFormType.PASSWORD,
              span: 3,
            },
            {
              label: 'Xác nhận mật khẩu',
              name: 'confirmPassword',
              type: NKFormType.PASSWORD,
              span: 3,
            },
          ]}
          defaultValues={{
            newPassword: '',
            password: '',
            confirmPassword: '',
          }}
          title="Cập nhật mật khẩu"
          onExtraSuccessAction={() => {
            userMeQuery.refetch();
          }}
        />
      </div>
    </div>
  );
};

export default Page;
