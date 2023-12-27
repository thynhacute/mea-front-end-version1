'use client';

import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PlusOutlined } from '@ant-design/icons';
import { Dialog } from '@headlessui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from 'antd';
import joi from 'joi';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { EquipmentCategoryIV1CreateDto, EquipmentCategoryIV1UpdateDto, equipmentCategoryApi } from '@/core/api/equipment-category.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';
import { toastError } from '@/core/utils/api.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteOne = useMutation(
    (id: string) => {
      return equipmentCategoryApi.v1Delete(id);
    },
    {
      onSuccess: () => {
        toast.success('Xoá thành công');
        queryClient.invalidateQueries();
      },
      onError: toastError,
    },
  );

  const [openEditModal, setOpenEditModal] = React.useState(false);

  const [editId, setEditId] = React.useState<string | null>(null);
  const dataQuery = useQuery(['equipment-category', editId], () => equipmentCategoryApi.v1GetById(editId as string), {
    enabled: !!editId,
  });

  const handleEdit = (id: string) => {
    setEditId(id);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditId(null);
  };

  return (
    <>
      <Modal open={openEditModal} footer={null} onCancel={() => handleCloseEditModal()}>
        {Boolean(dataQuery.data && editId) && (
          <FormBuilder<EquipmentCategoryIV1UpdateDto>
            apiAction={(dto) => {
              if (!editId) {
                return Promise.reject();
              }

              return equipmentCategoryApi.v1Update(editId, dto);
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
              name: dataQuery.data?.name || '',
              description: dataQuery.data?.description || '',
              code: dataQuery.data?.code || '',
            }}
            title="Cập nhật danh mục thiết bị"
            btnLabel="Cập nhật"
            onExtraSuccessAction={() => {
              handleCloseEditModal();
              queryClient.invalidateQueries();
            }}
          />
        )}
      </Modal>
      <TableBuilder
        sourceKey="equipment-category"
        title="Quản lý danh mục thiết bị"
        queryApi={equipmentCategoryApi.v1Get}
        extraButtons={
          <div key="3">
            <ModalBuilder
              btnLabel="Tạo mới"
              modalTitle={``}
              btnProps={{
                size: 'middle',
                type: 'default',
                icon: <PlusOutlined rev="" />,
              }}
            >
              {(close) => (
                <FormBuilder<EquipmentCategoryIV1CreateDto>
                  apiAction={equipmentCategoryApi.v1Create}
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
                    name: '',
                    code: '',
                    description: '',
                  }}
                  title="Tạo danh mục thiết bị"
                  btnLabel="Tạo"
                  onExtraSuccessAction={() => {
                    close();
                    queryClient.invalidateQueries();
                  }}
                />
              )}
            </ModalBuilder>
          </div>
        }
        actionColumns={[
          {
            label: 'Xem chi tiết',
            onClick: (record) => {
              const id = _get(record, 'id');
              if (id) {
                router.push(NKRouter.equipment.category.detail(id));
              }
            },
          },
          {
            label: 'Chỉnh sửa',
            onClick: (record) => {
              const id = _get(record, 'id');
              console.log(id, 'WTF');
              if (id) {
                handleEdit(id);
              }
            },
          },
          {
            label: 'Xoá',
            onClick: (record) => {
              const id = _get(record, 'id');
              if (id) {
                deleteOne.mutate(id);
              }
            },
          },
        ]}
        columns={[
          {
            key: 'name',
            title: 'Tên',
            type: FieldType.TEXT,
          },
          {
            key: 'code',
            title: 'Mã',
            type: FieldType.TEXT,
          },
          {
            key: 'description',
            title: 'Mô tả',
            type: FieldType.MULTILINE_TEXT,
          },
          {
            key: 'createdAt',
            title: 'Ngày tạo',
            type: FieldType.TIME_FULL,
          },
          {
            key: 'updatedAt',
            title: 'Ngày cập nhật',
            type: FieldType.TIME_FULL,
          },
        ]}
        filters={[
          {
            name: 'name',
            label: 'Tên',
            type: NKFormType.TEXT,
            comparator: FilterComparator.LIKE,
            defaultValue: '',
          },
          {
            name: 'code',
            label: 'Mã',
            type: NKFormType.TEXT,
            comparator: FilterComparator.LIKE,
            defaultValue: '',
          },
        ]}
      />
    </>
  );
};

export default Page;
