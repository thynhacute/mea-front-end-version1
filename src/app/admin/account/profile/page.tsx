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
        {Boolean(userMeQuery.data) && (
          <FormBuilder<IV1UpdateProfileDto>
            apiAction={userMeApi.v1Put}
            schema={{
              birthday: joi.date().required(),
              email: joi.string().required(),
              gender: joi.string().required(),
              name: joi.string().required(),
              address: joi.string().required(),
              phone: joi.string().required(),
            }}
            fields={[
              {
                label: 'Name',
                name: 'name',
                type: NKFormType.TEXT,
                span: 3,
              },
              {
                label: 'Phone',
                name: 'phone',
                type: NKFormType.TEXT,
                span: 3,
              },
              {
                label: 'Address',
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
            title="Update Profile"
            onExtraSuccessAction={() => {
              userMeQuery.refetch();
            }}
          />
        )}
      </div>
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
              label: 'Old Password',
              name: 'password',
              type: NKFormType.PASSWORD,
              span: 3,
            },
            {
              label: 'New Password',
              name: 'newPassword',
              type: NKFormType.PASSWORD,
              span: 3,
            },
            {
              label: 'Confirm Password',
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
          title="Update Password"
          onExtraSuccessAction={() => {
            userMeQuery.refetch();
          }}
        />
      </div>
    </div>
  );
};

export default Page;
