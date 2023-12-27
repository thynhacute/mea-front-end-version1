'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { brandApi } from '@/core/api/brand.api';
import { equipmentCategoryApi } from '@/core/api/equipment-category.api';
import { EquipmentIV1UpdateDto, equipmentApi } from '@/core/api/equipment.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;

  const queryData = useQuery(
    ['equipment', id],
    () => {
      return equipmentApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return (
    <div className="max-w-xl mx-auto">
      {Boolean(queryData.data) && (
        <FormBuilder<EquipmentIV1UpdateDto>
          apiAction={(dto) => {
            return equipmentApi.v1Update(id, dto);
          }}
          schema={{
            name: joi.any(),
            code: joi.any(),
            description: joi.any(),
            imageUrls: joi.any(),
            brandId: joi.any(),
            importDate: joi.any(),
            equipmentCategoryId: joi.any(),
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
            imageUrls: queryData.data?.imageUrls || [],
            brandId: queryData.data?.brand?.id || '',
            equipmentCategoryId: queryData.data?.equipmentCategory?.id || '',
            importDate: queryData.data?.importDate || nkMoment().format('YYYY-MM-DD'),
            endOfWarrantyDate: queryData.data?.endOfWarrantyDate || nkMoment().format('YYYY-MM-DD'),
            mfDate: queryData.data?.mfDate || nkMoment().format('YYYY-MM-DD'),
          }}
          title="Cập nhật thiết bị"
          onExtraSuccessAction={() => {
            router.push(NKRouter.equipment.detail(id));
          }}
          btnLabel="Cập nhật"
        />
      )}
    </div>
  );
};

export default Page;
