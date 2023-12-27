'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { departmentApi } from '@/core/api/department.api';
import { ImportRequestIV1CreateDto, importRequestApi } from '@/core/api/import-request';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();

  return (
    <div className="max-w-xl">
      <FormBuilder<ImportRequestIV1CreateDto>
        apiAction={importRequestApi.v1Create}
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
          name: '',
          description: '',
          departmentId: '',
          expected: '',
          importRequestItems: [],
        }}
        title="Tạo yêu cầu đặt thiết bị"
        onExtraSuccessAction={(data) => {
          const id = _get(data, 'id');
          router.push(NKRouter.importRequest.detail(id));
        }}
        btnLabel="Tạo"
      />
    </div>
  );
};

export default Page;
