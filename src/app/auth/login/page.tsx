'use client';

import Link from 'next/link';

import { joiResolver } from '@hookform/resolvers/joi';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'antd';
import joi from 'joi';
import _get from 'lodash.get';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';

import { NKConstant } from '@/core/NKConstant';
import { NKRouter } from '@/core/NKRouter';
import { IV1AuthLoginUsername, authApi } from '@/core/api/auth.api';
import FieldImage from '@/core/components/field/FieldImage';
import NKFormWrapper from '@/core/components/form/NKFormWrapper';
import NKTextField from '@/core/components/form/NKTextField';
import { store } from '@/core/store';
import { userActions } from '@/core/store/user';

const defaultValues: IV1AuthLoginUsername = {
  username: '',
  password: '',
};

export default function Page() {
  const formMethods = useForm<IV1AuthLoginUsername>({
    defaultValues,
  });
  const authLoginMutation = useMutation(
    (data: IV1AuthLoginUsername) => {
      return authApi.v1Login(data);
    },
    {
      onSuccess: (data) => {
        const cookies = new Cookies();
        cookies.set(NKConstant.TOKEN_COOKIE_KEY, data.token, {
          path: '/',
        });
        store.dispatch(userActions.setToken(data.token));
        window.location.reload();
      },
      onError(error) {
        const message = _get(error, 'data.message', '');
        if (message) toast.error(message);
      },
    },
  );

  return (
    <NKFormWrapper formMethods={formMethods} formActionError={authLoginMutation.error}>
      <form
        className="flex flex-col px-8 py-16 bg-white rounded-lg w-96 fade-in"
        onSubmit={formMethods.handleSubmit((data) => {
          authLoginMutation.mutate(data);
        })}
      >
        <div className="flex items-center justify-center">
          <div className="w-32 h-32">
            <FieldImage src="/assets/images/logo.png" className="w-full h-full" />
          </div>
        </div>
        <div className="flex-1 mb-4 text-lg font-semibold text-center text-black">Đăng nhập</div>
        <div className="flex flex-col w-full gap-4">
          <NKTextField name="username" label="Tài Khoản" placeholder="Tên đăng nhập" />
          <NKTextField name="password" label="Mật khẩu" type="password" placeholder="Mật khẩu" />
          <Button htmlType="submit" type="primary" loading={authLoginMutation.isLoading}>
            Đăng nhập
          </Button>
        </div>
        <div className="mt-5 text-left">
          <Link href={NKRouter.auth.forgotPassword()} className="no-underline">
            <span className="text-xs font-semibold text-blue-500 ">Quên mật khẩu</span>
          </Link>
        </div>
      </form>
    </NKFormWrapper>
  );
}
