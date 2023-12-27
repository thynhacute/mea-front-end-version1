'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { BrandIV1UpdateDto, brandApi } from '@/core/api/brand.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;

  const brand = useQuery(
    ['brand', id],
    () => {
      return brandApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return (
    <div className="max-w-xl">
      {Boolean(brand.data) && (
        <FormBuilder<BrandIV1UpdateDto>
          apiAction={(dto) => {
            return brandApi.v1Update(id, dto);
          }}
          schema={{
            name: joi.any(),
            code: joi.any(),
            description: joi.any(),
            imageUrl: joi.any(),
            status: joi.any(),
          }}
          fields={[
            {
              label: 'Tên',
              name: 'name',
              type: NKFormType.TEXT,
              span: 3,
            },
            {
              label: 'Mã',
              name: 'code',
              type: NKFormType.TEXT,
              span: 3,
            },
            {
              label: 'Trạng thái',
              name: 'status',
              type: NKFormType.SELECT_API_OPTION,
              useAction: brandApi.v1GetEnumStatus,
              span: 3,
            },
            {
              label: 'Mô tả',
              name: 'description',
              type: NKFormType.TEXTAREA,
              span: 3,
            },
            {
              label: 'Ảnh',
              name: 'imageUrl',
              type: NKFormType.UPLOAD_IMAGE,
              span: 3,
            },
          ]}
          defaultValues={{
            name: brand.data?.name || '',
            description: brand.data?.description || '',
            code: brand.data?.code || '',
            status: brand.data?.status || '',
            imageUrl: brand.data?.imageUrl || '',
          }}
          title="Cập nhật nhãn hiệu"
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
