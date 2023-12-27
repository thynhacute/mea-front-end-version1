'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { ImportInventoryIV1CreateDto, importInventoryApi } from '@/core/api/import-inventory';
import { importPlanApi } from '@/core/api/import-plan.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { addNoSelectOption, mapListToOptions } from '@/core/utils/api.helper';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();

  return (
    <div className="max-w-xl">
      <FormBuilder<ImportInventoryIV1CreateDto>
        apiAction={importInventoryApi.v1Create}
        fields={[
          {
            label: 'Tên',
            name: 'name',
            type: NKFormType.TEXT,
            span: 3,
          },
          {
            label: 'Mô tả',
            name: 'note',
            type: NKFormType.TEXTAREA,
            span: 3,
          },
          // {
          //     label: 'Ngày nhập kho',
          //     name: 'importDate',
          //     type: NKFormType.DATE,
          //     span: 3,
          // },
          {
            label: 'Kế hoạch mua sắm',
            name: 'importPlanId',
            type: NKFormType.SELECT_API_OPTION,
            useAction: async (data) => addNoSelectOption(mapListToOptions(await importPlanApi.v1GetSelect(data), 'code')),
            span: 3,
          },
        ]}
        defaultValues={{
          importDate: nkMoment().format('YYYY-MM-DD'),
          importPlanId: '',
          name: '',
          note: '',
        }}
        title="Tạo phiếu nhập kho"
        onExtraSuccessAction={(data) => {
          const id = _get(data, 'id');
          router.push(NKRouter.importInventory.detail(id));
        }}
        btnLabel="Tạo"
      />
    </div>
  );
};

export default Page;
