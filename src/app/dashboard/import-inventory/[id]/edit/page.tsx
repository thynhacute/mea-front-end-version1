'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { ImportInventoryIV1UpdateDto, importInventoryApi } from '@/core/api/import-inventory';
import { importPlanApi } from '@/core/api/import-plan.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { addNoSelectOption, mapListToOptions } from '@/core/utils/api.helper';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;

  const queryData = useQuery(
    ['import-inventory', id],
    () => {
      return importInventoryApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onSuccess: (data) => {
        if (data.status !== 'DRAFT') {
          router.push(NKRouter.importInventory.detail(id));
          toast.error('Phiếu nhập kho đã được duyệt, không thể chỉnh sửa');
        }
      },
    },
  );

  if (queryData.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-xl">
      {Boolean(queryData.data) && (
        <FormBuilder<ImportInventoryIV1UpdateDto>
          apiAction={(data) => importInventoryApi.v1Update(id, data)}
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
            importDate: nkMoment(queryData.data?.importDate).format('YYYY-MM-DD') || nkMoment().format('YYYY-MM-DD'),
            importPlanId: queryData.data?.importPlan?.id || '',
            name: queryData.data?.name || '',
            note: queryData.data?.note || '',
          }}
          title="Cập nhật phiếu nhập kho"
          onExtraSuccessAction={() => {
            router.push(NKRouter.importInventory.detail(id));
          }}
          btnLabel="Cập nhật"
        />
      )}
    </div>
  );
};

export default Page;
