'use client';

import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from 'antd';
import joi from 'joi';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { SupplyCategoryIV1CreateDto, SupplyCategoryIV1UpdateDto, supplyCategoryApi } from '@/core/api/supply-category.api';
import { supplyApi } from '@/core/api/supply.api';
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
      return supplyCategoryApi.v1Delete(id);
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
  const dataQuery = useQuery(['supply-category', editId], () => supplyCategoryApi.v1GetById(editId as string), {
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
          <FormBuilder<SupplyCategoryIV1UpdateDto>
            apiAction={(dto) => {
              if (!editId) {
                return Promise.reject();
              }
              return supplyCategoryApi.v1Update(editId, dto);
            }}
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
              name: dataQuery.data?.name || '',
              description: dataQuery.data?.description || '',
            }}
            title="Cập nhật danh mục kho"
            btnLabel="Cập nhật"
            onExtraSuccessAction={() => {
              queryClient.invalidateQueries();
              handleCloseEditModal();
            }}
          />
        )}
      </Modal>
      <TableBuilder
        sourceKey="supply-category"
        title="Quản lý vật tư"
        queryApi={supplyCategoryApi.v1Get}
        extraButtons={
          <div key="3">
            <ModalBuilder
              btnLabel="Tạo mới"
              modalTitle={`Thêm Vật Tư`}
              btnProps={{
                size: 'middle',
                type: 'default',
                icon: <PlusOutlined rev="" />,
              }}
            >
              {(close) => (
                <FormBuilder<SupplyCategoryIV1CreateDto>
                  apiAction={(dto) => {
                    return supplyCategoryApi.v1Create(dto);
                  }}
                  onExtraSuccessAction={() => {
                    queryClient.invalidateQueries();
                    close();
                  }}
                  btnLabel="Thêm"
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
                    description: '',
                    name: '',
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
                router.push(NKRouter.supply.category.detail(id));
              }
            },
          },
          {
            label: 'Chỉnh sửa',
            onClick: (record) => {
              const id = _get(record, 'id');
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
        ]}
      />
    </>
  );
};

export default Page;
