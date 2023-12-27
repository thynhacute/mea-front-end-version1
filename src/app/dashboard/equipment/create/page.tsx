'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import joi from 'joi';

import { NKRouter } from '@/core/NKRouter';
import { brandApi } from '@/core/api/brand.api';
import { equipmentCategoryApi } from '@/core/api/equipment-category.api';
import { equipmentStatusApi } from '@/core/api/equipment-status.api';
import { EquipmentIV1CreateDto, equipmentApi } from '@/core/api/equipment.api';
import { supplyCategoryApi } from '@/core/api/supply-category.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();

  return (
    <div className="max-w-xl">
      <FormBuilder<EquipmentIV1CreateDto>
        apiAction={equipmentApi.v1Create}
        schema={{
          name: joi.any(),
          code: joi.any(),
          description: joi.any(),
          imageUrls: joi.any(),
          brandId: joi.any(),
          importDate: joi.any(),
          equipmentCategoryId: joi.any(),
          equipmentStatus: joi.any(),
          endOfWarrantyDate: joi.any(),
          mfDate: joi.any(),
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
            label: 'Nhãn hiệu',
            name: 'brandId',
            type: NKFormType.SELECT_API_OPTION,
            useAction: brandApi.v1GetSelect,
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
            label: 'Ngày sản xuất',
            name: 'mfDate',
            type: NKFormType.DATE,
            span: 3,
          },
          {
            label: 'Ngày hết hạn bảo hành',
            name: 'endOfWarrantyDate',
            type: NKFormType.DATE,
            span: 3,
          },
          {
            label: 'Ngày nhập kho',
            name: 'importDate',
            type: NKFormType.DATE,
            span: 3,
          },
          {
            label: 'Tình trạng thiết bị',
            name: 'equipmentStatus',
            type: NKFormType.SELECT_API_OPTION,
            span: 3,
            useAction: equipmentStatusApi.v1GetEnumStatus,
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
          imageUrls: [],
          description: '',
          brandId: '',
          equipmentCategoryId: '',
          importDate: nkMoment().format('YYYY-MM-DD'),
          endOfWarrantyDate: nkMoment().format('YYYY-MM-DD'),
          mfDate: nkMoment().format('YYYY-MM-DD'),
          equipmentStatus: '',
        }}
        title="Tạo vật tư mới"
        onExtraSuccessAction={() => {
          router.push(NKRouter.equipment.list());
        }}
        btnLabel="Tạo"
      />
    </div>
  );
};

export default Page;
