'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { SupplyCategoryIV1UpdateDto, supplyCategoryApi } from '@/core/api/supply-category.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;

  const dataQuery = useQuery(
    ['supply-category', id],
    () => {
      return supplyCategoryApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return (
    <div className="max-w-xl">
      {Boolean(dataQuery.data) && (
        <FormBuilder<SupplyCategoryIV1UpdateDto>
          apiAction={(dto) => {
            return supplyCategoryApi.v1Update(id, dto);
          }}
          schema={{
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
            name: dataQuery.data?.name || '',
            description: dataQuery.data?.description || '',
          }}
          title="Cập nhật danh mục kho"
          btnLabel="Cập nhật"
          onExtraSuccessAction={() => {
            router.push(NKRouter.supply.category.detail(id));
          }}
        />
      )}
    </div>
  );
};

export default Page;
