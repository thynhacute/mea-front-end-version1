'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { Button } from 'antd';
import joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { EquipmentCategoryIV1UpdateDto, equipmentCategoryApi } from '@/core/api/equipment-category.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { EquipmentCategory } from '@/core/models/equipmentCategory';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const id = _get(params, 'id') as string;

  const equipmentCategory = useQuery(
    ['equipment-category', id],
    () => {
      return equipmentCategoryApi.v1GetById(id);
    },
    {},
  );

  const router = useRouter();

  if (equipmentCategory.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-xl">
      <FieldBuilder<EquipmentCategory>
        fields={[
          {
            label: 'Tên',
            key: 'name',
            type: FieldType.TEXT,
            span: 3,
          },
          {
            label: 'Mã',
            key: 'code',
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
        record={equipmentCategory.data}
        extra={
          <div className="flex items-center gap-4">
            <CTAButton
              ctaApi={() => {
                const res = equipmentCategoryApi.v1Delete(id);
                router.push(NKRouter.equipment.category.list());
                return res;
              }}
              isConfirm
              extraOnSuccess={() => router.push(NKRouter.equipment.category.list())}
            >
              <Button danger>Xoá</Button>
            </CTAButton>

            <ModalBuilder
              btnLabel="Chỉnh sửa"
              modalTitle={``}
              btnProps={{
                size: 'middle',
                type: 'default',
              }}
            >
              {(close) => (
                <FormBuilder<EquipmentCategoryIV1UpdateDto>
                  apiAction={(dto) => {
                    return equipmentCategoryApi.v1Update(id, dto);
                  }}
                  schema={{
                    name: joi.any(),
                    code: joi.any(),
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
                      label: 'Mã',
                      name: 'code',
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
                    name: equipmentCategory.data?.name || '',
                    description: equipmentCategory.data?.description || '',
                    code: equipmentCategory.data?.code || '',
                  }}
                  title="Cập nhật danh mục thiết bị"
                  btnLabel="Cập nhật"
                  onExtraSuccessAction={() => {
                    equipmentCategory.refetch();
                    close();
                  }}
                />
              )}
            </ModalBuilder>
          </div>
        }
        title="Chi tiết danh mục thiết bị"
      />
    </div>
  );
};

export default Page;
