'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { BrandIV1CreateDto, brandApi } from '@/core/api/brand.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();

  return (
    <div className="max-w-xl">
      <FormBuilder<BrandIV1CreateDto>
        apiAction={brandApi.v1Create}
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
          name: '',
          code: '',
          imageUrl: '',
          status: '',
          description: '',
        }}
        title="Tạo nhãn hiệu"
        onExtraSuccessAction={(data) => {
          const id = _get(data, 'id');
          router.push(NKRouter.brand.detail(id));
        }}
        btnLabel="Tạo"
      />
    </div>
  );
};

export default Page;
