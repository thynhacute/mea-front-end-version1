'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { BrandIV1UpdateDto, brandApi } from '@/core/api/brand.api';
import { equipmentCategoryApi } from '@/core/api/equipment-category.api';
import { supplyCategoryApi } from '@/core/api/supply-category.api';
import { SupplyIV1UpdateDto, supplyApi } from '@/core/api/supply.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;

  const queryData = useQuery(
    ['supply', id],
    () => {
      return supplyApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return (
    <div className="max-w-xl mx-auto">
      {Boolean(queryData.data) && (
        <FormBuilder<SupplyIV1UpdateDto>
          apiAction={(dto) => {
            return supplyApi.v1Update(id, dto);
          }}
          schema={{
            name: joi.any(),
            code: joi.any(),
            description: joi.any(),
            imageUrls: joi.any(),
            status: joi.any(),
            brandId: joi.any(),
            equipmentCategoryId: joi.any(),
            supplyCategoryId: joi.any(),
            unit: joi.any(),
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
            name: queryData.data?.name || '',
            description: queryData.data?.description || '',
            code: queryData.data?.code || '',
            unit: queryData.data?.unit || '',
            status: queryData.data?.status || '',
            imageUrls: queryData.data?.imageUrls || [],
            brandId: queryData.data?.brand?.id || '',
            equipmentCategoryId: queryData.data?.equipmentCategory?.id || '',
            supplyCategoryId: queryData.data?.supplyCategory?.id || '',
          }}
          title="Cập nhật vật tư"
          onExtraSuccessAction={(data) => {
            router.push(NKRouter.supply.detail(id));
          }}
          btnLabel="Cập nhật"
        />
      )}
    </div>
  );
};

export default Page;
