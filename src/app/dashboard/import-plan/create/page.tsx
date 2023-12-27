'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { ImportPlanIV1CreateDto, importPlanApi } from '@/core/api/import-plan.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();

  return (
    <div className="max-w-xl">
      <FormBuilder<ImportPlanIV1CreateDto>
        apiAction={importPlanApi.v1Create}
        schema={{
          endImportDate: joi.any(),
          startImportDate: joi.any(),
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
          startImportDate: nkMoment().format('YYYY-MM-DD'),
          endImportDate: nkMoment().format('YYYY-MM-DD'),
          name: `Kế hoạch mua sắm ${nkMoment().format('YYYY-MM-DD')}`,
        }}
        title="Tạo kế hoạch mua sắm"
        onExtraSuccessAction={(data) => {
          const id = _get(data, 'id');

          if (id) {
            router.push(NKRouter.importPlan.detail(id));
          }
        }}
        btnLabel="Tạo"
      />
    </div>
  );
};

export default Page;
