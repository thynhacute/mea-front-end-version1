'use client';

import Link from 'next/link';

import { useMutation } from '@tanstack/react-query';
import { Button } from 'antd';
import { useForm } from 'react-hook-form';
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
        <div className="flex-1 mb-4 text-lg font-semibold text-center text-black">Quên Mật Khẩu</div>
        <div className="flex flex-col w-full gap-4">
          <NKTextField name="email" label="Email" placeholder="email" />

          <Button htmlType="submit" type="primary" loading={authLoginMutation.isLoading}>
            Gửi Yêu Cầu
          </Button>
        </div>
        <div className="mt-5 text-left">
          <Link href={NKRouter.auth.login()} className="no-underline">
            <span className="text-xs font-semibold text-blue-500 ">Đăng Nhập</span>
          </Link>
        </div>
      </form>
    </NKFormWrapper>
  );
}
