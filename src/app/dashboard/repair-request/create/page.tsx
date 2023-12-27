'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import joi from 'joi';

import { NKRouter } from '@/core/NKRouter';
import { equipmentApi } from '@/core/api/equipment.api';
import { RepairRequestIV1CreateDto, repairRequestApi } from '@/core/api/repair-request.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();

  return (
    <div className="max-w-xl">
      <FormBuilder<RepairRequestIV1CreateDto>
        apiAction={repairRequestApi.v1Create}
        schema={{
          description: joi.any(),
          equipmentId: joi.any(),
          imageUrls: joi.any(),
        }}
        fields={[
          {
            label: 'Mô tả',
            name: 'description',
            type: NKFormType.TEXTAREA,
            span: 3,
          },

          {
            label: 'Hình ảnh',
            name: 'imageUrls',
            type: NKFormType.MULTI_UPLOAD_IMAGE,
            span: 3,
          },
          {
            label: 'Thiết bị',
            name: 'equipmentId',
            type: NKFormType.SELECT_API_OPTION,
            span: 3,
            useAction: equipmentApi.v1GetAll,
          },
        ]}
        defaultValues={{
          equipmentId: '',
          imageUrls: [],
          description: '',
        }}
        title="Tạo yêu cầu sửa chữa"
        onExtraSuccessAction={() => {
          router.push(NKRouter.repairRequest.list());
        }}
        btnLabel="Tạo"
      />
    </div>
  );
};

export default Page;
