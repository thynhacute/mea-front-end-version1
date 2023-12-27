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
import { BrandIV1CreateDto, BrandIV1UpdateDto, brandApi } from '@/core/api/brand.api';
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
      return brandApi.v1Delete(id);
    },
    {
      onSuccess: () => {
        toast.success('Xoá thành công');
        queryClient.invalidateQueries();
      },
      onError: toastError,
    },
  );
  const [editId, setEditId] = React.useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const dataQuery = useQuery(['brand', editId], () => brandApi.v1GetById(editId as string), {
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
          <FormBuilder<BrandIV1UpdateDto>
            apiAction={(dto) => {
              return brandApi.v1Update(editId || '', dto);
            }}
            schema={{
              name: joi.any(),
              code: joi.any(),
              description: joi.any(),
              imageUrl: joi.any(),
              status: joi.any(),
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
                label: 'Trạng thái',
                name: 'status',
                type: NKFormType.SELECT_API_OPTION,
                useAction: brandApi.v1GetEnumStatus,
                span: 3,
              },
              {
                label: 'Mô tả',
                name: 'description',
                type: NKFormType.TEXTAREA,
                span: 3,
              },
              {
                label: 'Ảnh',
                name: 'imageUrl',
                type: NKFormType.UPLOAD_IMAGE,
                span: 3,
              },
            ]}
            defaultValues={{
              name: dataQuery.data?.name || '',
              description: dataQuery.data?.description || '',
              code: dataQuery.data?.code || '',
              status: dataQuery.data?.status || '',
              imageUrl: dataQuery.data?.imageUrl || '',
            }}
            title="Cập nhật nhãn hiệu"
            onExtraSuccessAction={() => {
              queryClient.invalidateQueries();
            }}
            btnLabel="Cập nhật"
          />
        )}
      </Modal>
      <TableBuilder
        sourceKey="brands"
        title="Quản lý nhãn hiệu"
        queryApi={brandApi.v1Get}
        extraButtons={
          <div key="3">
            <ModalBuilder
              btnLabel="Tạo mới"
              modalTitle=""
              btnProps={{
                icon: <PlusOutlined rev="" />,
              }}
            >
              <FormBuilder<BrandIV1CreateDto>
                apiAction={brandApi.v1Create}
                schema={{
                  name: joi.any(),
                  code: joi.any(),
                  description: joi.any(),
                  imageUrl: joi.any(),
                  status: joi.any(),
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
                    label: 'Trạng thái',
                    name: 'status',
                    type: NKFormType.SELECT_API_OPTION,
                    useAction: brandApi.v1GetEnumStatus,
                    span: 3,
                  },
                  {
                    label: 'Mô tả',
                    name: 'description',
                    type: NKFormType.TEXTAREA,
                    span: 3,
                  },
                  {
                    label: 'Ảnh',
                    name: 'imageUrl',
                    type: NKFormType.UPLOAD_IMAGE,
                    span: 3,
                  },
                ]}
                defaultValues={{
                  name: '',
                  code: '',
                  imageUrl: '',
                  status: '',
                  description: '',
                }}
                title="Tạo nhãn hiệu"
                onExtraSuccessAction={(data) => {
                  const id = _get(data, 'id');
                  router.push(NKRouter.brand.detail(id));
                }}
                btnLabel="Tạo"
              />
            </ModalBuilder>
            {/* <Link href={NKRouter.brand.create()}>
              <Button >Tạo mới</Button>
            </Link> */}
          </div>
        }
        actionColumns={[
          {
            label: 'Xem chi tiết',
            onClick: (record) => {
              const id = _get(record, 'id');
              if (id) {
                router.push(NKRouter.brand.detail(id));
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
            key: 'imageUrl',
            title: 'Ảnh',
            type: FieldType.THUMBNAIL,
          },

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
            key: 'createdAt',
            title: 'Ngày tạo',
            type: FieldType.TIME_FULL,
          },
          {
            key: 'updatedAt',
            title: 'Ngày cập nhật',
            type: FieldType.TIME_FULL,
          },
          {
            key: 'status',
            title: 'Trạng thái',
            type: FieldType.BADGE_API,
            apiAction: brandApi.v1GetEnumStatus,
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
          {
            name: 'status',
            label: 'Trạng thái',
            type: NKFormType.SELECT_API_OPTION,
            apiAction: brandApi.v1GetEnumStatus,
            comparator: FilterComparator.LIKE,
            defaultValue: '',
          },
        ]}
      />
    </>
  );
};

export default Page;
