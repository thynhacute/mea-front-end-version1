'use client';

import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from 'antd';
import joi from 'joi';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { DepartmentIV1CreateDto, DepartmentIV1UpdateDto, departmentApi } from '@/core/api/department.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { toastError } from '@/core/utils/api.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userStoreState = useSelector<RootState, UserState>((state) => state.user);
  const deleteOne = useMutation(
    (id: string) => {
      return departmentApi.v1Delete(id);
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
  const dataQuery = useQuery(['department', editId], () => departmentApi.v1GetById(editId as string), {
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
          <FormBuilder<DepartmentIV1UpdateDto>
            apiAction={(dto) => {
              if (!editId) {
                return Promise.reject();
              }
              return departmentApi.v1Update(editId, dto);
            }}
            schema={{
              status: joi.any(),
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
              status: dataQuery.data?.status || '',
              name: dataQuery.data?.name || '',
              description: dataQuery.data?.description || '',
            }}
            title="Cập nhật phòng ban"
            onExtraSuccessAction={() => {
              handleCloseEditModal();
              queryClient.invalidateQueries();
            }}
            btnLabel="Cập nhật"
          />
        )}
      </Modal>
      <TableBuilder
        sourceKey="department"
        title="Quản lý phòng ban"
        queryApi={departmentApi.v1Get}
        extraButtons={
          <div key="3">
            {userStoreState.isMaintenanceManager && userStoreState.isAdmin && (
              <>
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
                        close();
                        queryClient.invalidateQueries();
                      }}
                      btnLabel="Tạo"
                    />
                  )}
                </ModalBuilder>
              </>
            )}
          </div>
        }
        actionColumns={[
          {
            label: 'Xem chi tiết',
            onClick: (record) => {
              const id = _get(record, 'id');
              if (id) {
                router.push(NKRouter.department.detail(id));
              }
            },
          },

          ...(userStoreState.isMaintenanceManager && userStoreState.isAdmin
            ? ([
                {
                  label: 'Chỉnh sửa',
                  onClick: (record: any) => {
                    const id = _get(record, 'id');
                    if (id) {
                      handleEdit(id);
                    }
                  },
                },
                {
                  label: 'Xoá',
                  onClick: (record: any) => {
                    const id = _get(record, 'id');
                    if (id) {
                      deleteOne.mutate(id);
                    }
                  },
                },
              ] as any)
            : []),
        ]}
        columns={[
          {
            key: 'name',
            title: 'Tên',
            type: FieldType.TEXT,
          },
          {
            key: 'name',
            title: 'Mô tả',
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
            apiAction: departmentApi.v1GetEnumStatus,
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
            name: 'status',
            label: 'Trạng thái',
            type: NKFormType.SELECT_API_OPTION,
            apiAction: departmentApi.v1GetEnumStatus,
            comparator: FilterComparator.LIKE,
            defaultValue: '',
          },
        ]}
      />
    </>
  );
};

export default Page;
