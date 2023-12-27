'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import joi from 'joi';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { departmentApi } from '@/core/api/department.api';
import { ImportPlanIV1UpdateDto, importPlanApi } from '@/core/api/import-plan.api';
import { ImportRequestIV1UpdateDto, importRequestApi } from '@/core/api/import-request';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { nkMoment } from '@/core/utils/moment';
import { isSame } from '@/core/utils/object.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;

  const queryData = useQuery(
    ['import-request', id],
    () => {
      return importRequestApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onSuccess: (data) => {
        if (!isSame(data.status, 'DRAFT')) {
          router.push(NKRouter.importRequest.detail(id));
          toast.error('Yêu cầu đã được duyệt, không thể chỉnh sửa');
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
        <FormBuilder<ImportRequestIV1UpdateDto>
          apiAction={(data) => {
            return importRequestApi.v1Update(id, data);
          }}
          fields={[
            {
              label: 'Tên',
              name: 'name',
              type: NKFormType.TEXT,
              span: 3,
            },
            {
              label: 'Mô tả',
              name: 'description',
              type: NKFormType.TEXTAREA,
              span: 3,
            },
            {
              label: 'Phòng ban',
              name: 'departmentId',
              type: NKFormType.SELECT_API_OPTION,
              useAction: departmentApi.v1GetSelect,
              span: 3,
            },
            {
              label: 'Thời gian dự kiến',
              name: 'expected',
              type: NKFormType.SELECT_API_OPTION,
              useAction: importRequestApi.v1GetEnumExpected,
              span: 3,
            },
          ]}
          defaultValues={{
            name: queryData.data?.name || '',
            description: queryData.data?.description || '',
            departmentId: queryData.data?.department?.id || '',
            expected: queryData.data?.expected || '',
          }}
          title="Cập nhật yêu cầu đặt thiết bị"
          onExtraSuccessAction={() => {
            router.push(NKRouter.importRequest.detail(id));
          }}
          btnLabel="Cập nhật"
        />
      )}
    </div>
  );
};

export default Page;
