'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import joi from 'joi';

import { NKRouter } from '@/core/NKRouter';
import { EquipmentCategoryIV1CreateDto, equipmentCategoryApi } from '@/core/api/equipment-category.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();

  return (
    <div className="max-w-xl">
      <FormBuilder<EquipmentCategoryIV1CreateDto>
        apiAction={equipmentCategoryApi.v1Create}
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
          name: '',
          code: '',
          description: '',
        }}
        title="Tạo danh mục thiết bị"
        btnLabel="Tạo"
        onExtraSuccessAction={() => {
          router.push(NKRouter.equipment.category.list());
        }}
      />
    </div>
  );
};

export default Page;
