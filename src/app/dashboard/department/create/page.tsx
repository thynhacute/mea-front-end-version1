'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import joi from 'joi';

import { NKRouter } from '@/core/NKRouter';
import { DepartmentIV1CreateDto, departmentApi } from '@/core/api/department.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();

  return (
    <div className="max-w-xl">
      <FormBuilder<DepartmentIV1CreateDto>
        apiAction={departmentApi.v1Create}
        schema={{
          name: joi.any(),
          description: joi.any(),
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
        ]}
        defaultValues={{
          name: '',
          description: '',
        }}
        title="Tạo phòng ban"
        onExtraSuccessAction={() => {
          router.push(NKRouter.department.list());
        }}
        btnLabel="Tạo"
      />
    </div>
  );
};

export default Page;
