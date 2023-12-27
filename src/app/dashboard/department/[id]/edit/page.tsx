'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { DepartmentIV1UpdateDto, departmentApi } from '@/core/api/department.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;

  const queryData = useQuery(
    ['department', id],
    () => {
      return departmentApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return (
    <div className="max-w-xl">
      {Boolean(queryData.data) && (
        <FormBuilder<DepartmentIV1UpdateDto>
          apiAction={(dto) => {
            return departmentApi.v1Update(id, dto);
          }}
          schema={{
            status: joi.any(),
            name: joi.any(),
            description: joi.any(),
          }}
          fields={[
            {
              label: 'Tên',
              name: 'name',
              type: NKFormType.TEXT,
              span: 3,
            },

            {
              label: 'Mô tả',
              name: 'description',
              type: NKFormType.TEXTAREA,
              span: 3,
            },
          ]}
          defaultValues={{
            status: queryData.data?.status || '',
            name: queryData.data?.name || '',
            description: queryData.data?.description || '',
          }}
          title="Cập nhật phòng ban"
          onExtraSuccessAction={() => {
            router.push(NKRouter.brand.detail(id));
          }}
          btnLabel="Cập nhật"
        />
      )}
    </div>
  );
};

export default Page;
