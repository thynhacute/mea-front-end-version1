'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { equipmentApi } from '@/core/api/equipment.api';
import { RepairRequestIV1UpdateDto, repairRequestApi } from '@/core/api/repair-request.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;

  const queryData = useQuery(
    ['repair-request', id],
    () => {
      return repairRequestApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return (
    <div className="max-w-xl">
      {Boolean(queryData.data) && (
        <FormBuilder<RepairRequestIV1UpdateDto>
          apiAction={(dto) => {
            return repairRequestApi.v1Update(id, dto);
          }}
          schema={{
            equipmentId: joi.any(),
            description: joi.any(),
            imageUrls: joi.any(),
            status: joi.any(),
          }}
          fields={[
            {
              label: 'Mô tả',
              name: 'description',
              type: NKFormType.TEXTAREA,
              span: 3,
            },
            {
              label: 'Trạng thái',
              name: 'status',
              type: NKFormType.SELECT_API_OPTION,
              span: 3,
              useAction: repairRequestApi.v1GetEnumStatus,
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
            description: queryData.data?.description || '',
            equipmentId: queryData.data?.equipment.id || '',
            imageUrls: queryData.data?.imageUrls || [],
            status: queryData.data?.status || '',
          }}
          title="Cập nhật thông tin yêu cầu sửa chữa"
          onExtraSuccessAction={() => {
            router.push(NKRouter.repairRequest.detail(id));
          }}
          btnLabel="Cập nhật"
        />
      )}
    </div>
  );
};

export default Page;
