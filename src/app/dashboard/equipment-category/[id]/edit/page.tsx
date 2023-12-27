'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { BrandIV1UpdateDto, brandApi } from '@/core/api/brand.api';
import { EquipmentCategoryIV1UpdateDto, equipmentCategoryApi } from '@/core/api/equipment-category.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;

  const dataQuery = useQuery(
    ['equipment-category', id],
    () => {
      return equipmentCategoryApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return (
    <div className="max-w-xl">
      {Boolean(dataQuery.data) && (
        <FormBuilder<EquipmentCategoryIV1UpdateDto>
          apiAction={(dto) => {
            return equipmentCategoryApi.v1Update(id, dto);
          }}
          schema={{
            name: joi.any(),
            code: joi.any(),
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
              label: 'Mã',
              name: 'code',
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
            code: dataQuery.data?.code || '',
          }}
          title="Cập nhật danh mục thiết bị"
          btnLabel="Cập nhật"
          onExtraSuccessAction={() => {
            router.push(NKRouter.equipment.category.detail(id));
          }}
        />
      )}
    </div>
  );
};

export default Page;
