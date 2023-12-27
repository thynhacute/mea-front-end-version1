'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { departmentApi } from '@/core/api/department.api';
import { ExportInventoryIV1CreateDto, exportInventoryApi } from '@/core/api/export-inventory';
import { ImportInventoryIV1CreateDto, importInventoryApi } from '@/core/api/import-inventory';
import { importPlanApi } from '@/core/api/import-plan.api';
import { ImportRequestIV1CreateDto, importRequestApi } from '@/core/api/import-request';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { addNoSelectOption, mapListToOptions } from '@/core/utils/api.helper';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();

  return (
    <div className="max-w-xl">
      <FormBuilder<ExportInventoryIV1CreateDto>
        apiAction={exportInventoryApi.v1Create}
        fields={[
          {
            label: 'Ngày xuất kho',
            name: 'exportDate',
            type: NKFormType.DATE,
            span: 3,
          },
          {
            label: 'Đơn yêu cầu thiết bị',
            name: 'importRequestId',
            type: NKFormType.SELECT_API_OPTION,
            useAction: async (data) => (await importRequestApi.v1GetSelect(data)).filter((item) => item.status === 'APPROVED') as any,
            span: 3,
          },
          {
            label: 'Phòng ban',
            name: 'departmentId',
            type: NKFormType.SELECT_API_OPTION,
            useAction: async (data) => mapListToOptions(await departmentApi.v1GetSelect(data)),
            span: 3,
          },
          {
            label: 'Mô tả',
            name: 'note',
            type: NKFormType.TEXTAREA,
            span: 3,
          },
        ]}
        defaultValues={{
          exportDate: nkMoment().format('YYYY-MM-DD'),
          departmentId: '',
          importRequestId: '',
          note: '',
        }}
        title="Tạo phiếu xuất kho"
        onExtraSuccessAction={(data) => {
          const id = _get(data, 'id');
          router.push(NKRouter.exportInventory.detail(id));
        }}
        btnLabel="Tạo"
      />
    </div>
  );
};

export default Page;
