'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { departmentApi } from '@/core/api/department.api';
import { ExportInventoryIV1UpdateDto, exportInventoryApi } from '@/core/api/export-inventory';
import { ImportInventoryIV1UpdateDto, importInventoryApi } from '@/core/api/import-inventory';
import { importPlanApi } from '@/core/api/import-plan.api';
import { importRequestApi } from '@/core/api/import-request';
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
    ['export-inventory', id],
    () => {
      return exportInventoryApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onSuccess: (data) => {
        if (data.status !== 'REQUESTING') {
          router.push(NKRouter.exportInventory.detail(id));
          toast.error('Phiếu xuất kho đã được duyệt, không thể chỉnh sửa');
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
        <FormBuilder<ExportInventoryIV1UpdateDto>
          apiAction={(data) => exportInventoryApi.v1Update(id, data)}
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
            departmentId: queryData.data?.department?.id || '',
            exportDate: queryData.data?.exportDate || nkMoment().format('YYYY-MM-DD'),
            importRequestId: queryData.data?.importRequest?.id || '',
            note: queryData.data?.note || '',
          }}
          title="Cập nhật phiếu xuất kho"
          onExtraSuccessAction={() => {
            router.push(NKRouter.exportInventory.detail(id));
          }}
          btnLabel="Cập nhật"
        />
      )}
    </div>
  );
};

export default Page;
