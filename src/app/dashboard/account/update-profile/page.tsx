'use client';

import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import joi from 'joi';

import { IV1ChangePasswordDto, IV1UpdateProfileDto, userMeApi } from '@/core/api/user-me.api';
import { userApi } from '@/core/api/user.api';
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
      <div className="w-full max-w-md mx-auto">
        {Boolean(userMeQuery.data) && (
          <FormBuilder<IV1UpdateProfileDto>
            apiAction={userMeApi.v1Put}
            schema={{
              name: joi.string().required(),
              address: joi.string().required(),
              phone: joi.string().required(),
              birthday: joi.date().required(),
              email: joi.string().required(),
              gender: joi.string().required(),
            }}
            fields={[
              {
                label: 'Tên',
                name: 'name',
                type: NKFormType.TEXT,
                span: 3,
              },
              {
                label: 'Email',
                name: 'email',
                type: NKFormType.TEXT,
                span: 3,
              },
              {
                label: 'Số điên thoại',
                name: 'phone',
                type: NKFormType.TEXT,
                span: 3,
              },
              {
                label: 'Ngày sinh',
                name: 'birthday',
                type: NKFormType.DATE,
                span: 3,
              },
              {
                label: 'Giới tính',
                name: 'gender',
                type: NKFormType.SELECT_API_OPTION,
                useAction: userApi.v1GetEnumGender,
                span: 3,
              },
              {
                label: 'Địa chỉ',
                name: 'address',
                type: NKFormType.TEXTAREA,
                span: 3,
              },
            ]}
            defaultValues={{
              name: userMeQuery.data?.name || '',
              address: userMeQuery.data?.address || '',
              phone: userMeQuery.data?.phone || '',
              birthday: userMeQuery.data?.birthday || '',
              email: userMeQuery.data?.email || '',
              gender: userMeQuery.data?.gender || '',
            }}
            title="Cập Nhật Thông Tin"
            onExtraSuccessAction={() => {
              userMeQuery.refetch();
            }}
            btnLabel="Cập nhật"
          />
        )}
      </div>
    </div>
  );
};

export default Page;
