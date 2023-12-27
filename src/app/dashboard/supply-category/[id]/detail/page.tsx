'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { Button } from 'antd';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { SupplyCategoryIV1UpdateDto, supplyCategoryApi } from '@/core/api/supply-category.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { SupplyCategory } from '@/core/models/supplyCategory';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();

  const id = _get(params, 'id') as string;

  const queryData = useQuery(
    ['supply-category', id],
    () => {
      return supplyCategoryApi.v1GetById(id);
    },
    {},
  );

  const router = useRouter();

  if (queryData.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-xl">
      <FieldBuilder<SupplyCategory>
        fields={[
          {
            label: 'Tên',
            key: 'name',
            type: FieldType.TEXT,
            span: 3,
          },

          {
            label: 'Ngày tạo',
            key: 'createdAt',
            type: FieldType.TIME_FULL,
            span: 3,
          },

          {
            label: 'Ngày cập nhật',
            key: 'updatedAt',
            type: FieldType.TIME_FULL,
            span: 3,
          },

          {
            label: 'Bị xóa',
            key: 'isDeleted',
            type: FieldType.BOOLEAN,
            span: 3,
          },

          {
            label: 'Mô tả',
            key: 'description',
            type: FieldType.MULTILINE_TEXT,
            span: 3,
          },
        ]}
        record={queryData.data}
        extra={
          <div className="flex items-center gap-4">
            <CTAButton
              ctaApi={() => {
                const res = supplyCategoryApi.v1Delete(id);
                router.push(NKRouter.supply.category.list());
                return res;
              }}
              isConfirm
              extraOnSuccess={() => router.push(NKRouter.supply.category.list())}
            >
              <Button danger>Xoá</Button>
            </CTAButton>
            <ModalBuilder
              btnLabel="Chỉnh sửa"
              modalTitle={`Chỉnh sửa danh mục vật tư`}
              btnProps={{
                size: 'middle',
                type: 'default',
              }}
            >
              {(close) => (
                <FormBuilder<SupplyCategoryIV1UpdateDto>
                  apiAction={(dto) => {
                    return supplyCategoryApi.v1Update(id, dto);
                  }}
                  onExtraSuccessAction={() => {
                    queryData.refetch();
                    close();
                  }}
                  btnLabel="Cập nhật"
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
                  title=""
                  defaultValues={{
                    name: queryData.data?.name || '',
                    description: queryData.data?.description || '',
                  }}
                />
              )}
            </ModalBuilder>
          </div>
        }
        title="Chi tiết danh mục vật tư"
      />
    </div>
  );
};

export default Page;
