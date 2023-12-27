'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import joi from 'joi';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { ImportPlanIV1UpdateDto, importPlanApi } from '@/core/api/import-plan.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;

  const queryData = useQuery(
    ['import-plan', id],
    () => {
      return importPlanApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,

      onSuccess: (data) => {
        if (data.status !== 'DRAFT') {
          router.push(NKRouter.importPlan.detail(id));
          toast.error('Kế hoạch mua sắm đã được duyệt, không thể chỉnh sửa');
        }
      },
    },
  );

  return (
    <div className="max-w-xl">
      {Boolean(queryData.data) && (
        <FormBuilder<ImportPlanIV1UpdateDto>
          apiAction={(dto) => {
            return importPlanApi.v1Update(id, dto);
          }}
          schema={{
            startImportDate: joi.any(),
            endImportDate: joi.any(),
            name: joi.string().required(),
          }}
          fields={[
            {
              label: 'Ngày bắt đầu nhập kho',
              name: 'startImportDate',
              type: NKFormType.DATE,
              span: 3,
            },
            {
              label: 'Ngày kết thúc nhập kho',
              name: 'endImportDate',
              type: NKFormType.DATE,
              span: 3,
            },
          ]}
          defaultValues={{
            startImportDate: queryData.data?.startImportDate || nkMoment().format('YYYY-MM-DD'),
            endImportDate: queryData.data?.endImportDate || nkMoment().format('YYYY-MM-DD'),
            name: queryData.data?.name || '',
          }}
          title="Cập nhật kế hoạch mua sắm"
          onExtraSuccessAction={() => {
            router.push(NKRouter.importPlan.detail(id));
          }}
          btnLabel="Cập nhật"
        />
      )}
    </div>
  );
};

export default Page;
