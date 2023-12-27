'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import joi from 'joi';

import { NKRouter } from '@/core/NKRouter';
import { brandApi } from '@/core/api/brand.api';
import { equipmentCategoryApi } from '@/core/api/equipment-category.api';
import { supplyCategoryApi } from '@/core/api/supply-category.api';
import { SupplyIV1CreateDto, supplyApi } from '@/core/api/supply.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();

  return (
    <div className="max-w-xl mx-auto">
      <FormBuilder<SupplyIV1CreateDto>
        apiAction={supplyApi.v1Create}
        schema={{
          name: joi.any(),
          code: joi.any(),
          unit: joi.any(),
          description: joi.any(),
          imageUrls: joi.any(),
          status: joi.any(),
          brandId: joi.any(),
          equipmentCategoryId: joi.any(),
          supplyCategoryId: joi.any(),
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
            label: 'Đơn vị tính',
            name: 'unit',
            type: NKFormType.TEXT,
            span: 3,
          },
          {
            label: 'Nhãn hiệu',
            name: 'brandId',
            type: NKFormType.SELECT_API_OPTION,
            useAction: brandApi.v1GetSelect,
            span: 3,
          },
          {
            label: 'Danh mục vật tư',
            name: 'supplyCategoryId',
            type: NKFormType.SELECT_API_OPTION,
            useAction: supplyCategoryApi.v1GetSelect,
            span: 3,
          },
          {
            label: 'Danh mục thiết bị',
            name: 'equipmentCategoryId',
            type: NKFormType.SELECT_API_OPTION,
            useAction: equipmentCategoryApi.v1GetSelect,
            span: 3,
          },
          {
            label: 'Trạng thái',
            name: 'status',
            type: NKFormType.SELECT_API_OPTION,
            useAction: supplyApi.v1GetEnumStatus,
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
            name: 'imageUrls',
            type: NKFormType.MULTI_UPLOAD_IMAGE,
            span: 3,
          },
        ]}
        defaultValues={{
          name: '',
          code: '',
          unit: '',
          imageUrls: [],
          status: '',
          description: '',
          brandId: '',
          equipmentCategoryId: '',
          supplyCategoryId: '',
        }}
        title="Tạo vật tư mới"
        onExtraSuccessAction={() => {
          router.push(NKRouter.supply.list());
        }}
        btnLabel="Tạo"
      />
    </div>
  );
};

export default Page;
