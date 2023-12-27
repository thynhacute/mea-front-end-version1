'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import { RepairProviderIV1CreateDto, repairProviderApi } from '@/core/api/repair-provider.api';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';
import { RepairProvider } from '@/core/models/repairProvider';
import { toastError } from '@/core/utils/api.helper';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [viewId, setViewId] = React.useState<string | undefined>(undefined);
  const [editId, setEditId] = React.useState<string | undefined>(undefined);
  const deleteOne = useMutation(
    (id: string) => {
      return repairProviderApi.v1Delete(id);
    },
    {
      onSuccess: () => {
        toast.success('Xoá thành công');
        queryClient.invalidateQueries();
      },
      onError: toastError,
    },
  );

  const repairProvider = useQuery(
    ['repairProvider', viewId],
    () => {
      return repairProviderApi.v1GetById(viewId as string);
    },
    {
      enabled: !!viewId,
    },
  );

  const editRepairProvider = useQuery(
    ['repairProvider', editId],
    () => {
      return repairProviderApi.v1GetById(editId as string);
    },
    {
      enabled: !!editId,
    },
  );

  return (
    <>
      <Modal open={Boolean(editRepairProvider.data)} footer={null} onCancel={() => setEditId(undefined)}>
        <FormBuilder<RepairProviderIV1CreateDto>
          apiAction={(data) => {
            if (!editId) {
              return Promise.reject();
            }

            return repairProviderApi.v1Update(editId, data);
          }}
          fields={[
            {
              label: 'Tên',
              name: 'name',
              type: NKFormType.TEXT,
              span: 3,
            },
            {
              label: 'Số điện thoại',
              name: 'phone',
              type: NKFormType.TEXT,
              span: 3,
            },
            {
              label: 'Email',
              name: 'email',
              type: NKFormType.TEXT,
              span: 3,
            },
            {
              label: 'Ngày bắt đầu làm việc',
              name: 'startWorkDate',
              type: NKFormType.DATE,
              span: 3,
            },

            {
              label: 'Trạng thái',
              name: 'status',
              type: NKFormType.SELECT_API_OPTION,
              useAction: repairProviderApi.v1GetEnumStatus,
              span: 3,
            },
            {
              label: 'Địa chỉ',
              name: 'address',
              type: NKFormType.TEXTAREA,
              span: 3,
            },
          ]}
          defaultValues={{
            address: editRepairProvider.data?.address || '',
            email: editRepairProvider.data?.email || '',
            isExternal: editRepairProvider.data?.isExternal || false,
            name: editRepairProvider.data?.name || '',
            phone: editRepairProvider.data?.phone || '',
            startWorkDate: nkMoment(editRepairProvider.data?.startWorkDate).format('YYYY-MM-DD') || nkMoment().format('YYYY-MM-DD'),
          }}
          title="Chỉnh sửa nhân viên kỹ thuật"
          onExtraSuccessAction={(data) => {
            queryClient.invalidateQueries();
            setEditId(undefined);
          }}
          btnLabel="Lưu"
        />
      </Modal>
      <Modal open={Boolean(repairProvider.data)} footer={null} onCancel={() => setViewId(undefined)}>
        <FieldBuilder<RepairProvider>
          record={repairProvider.data}
          fields={[
            {
              key: 'id',
              label: 'ID',
              type: FieldType.UUID,
              span: 3,
            },
            {
              key: 'name',
              label: 'Tên',
              type: FieldType.TEXT,
              span: 3,
            },
            {
              key: 'email',
              label: 'Email',
              type: FieldType.TEXT,
              span: 3,
            },
            {
              key: 'address',
              label: 'Địa chỉ',
              type: FieldType.MULTILINE_TEXT,
              span: 3,
            },

            {
              key: 'phone',
              label: 'Số điện thoại',
              type: FieldType.TEXT,
              span: 3,
            },

            {
              key: 'startWorkDate',
              label: 'Ngày bắt đầu làm việc',
              type: FieldType.TIME_DATE,
              span: 3,
            },
            {
              key: 'status',
              label: 'Trạng thái',
              type: FieldType.BADGE_API,
              apiAction: repairProviderApi.v1GetEnumStatus,
              span: 3,
            },
          ]}
          title="Chi tiết nhân viên kỹ thuật"
        />
      </Modal>
      <TableBuilder
        sourceKey="repairProvider"
        title="Nhân Viên Kỹ Thuật"
        queryApi={repairProviderApi.v1Get}
        extraButtons={
          <div key="4">
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
                <FormBuilder<RepairProviderIV1CreateDto>
                  apiAction={repairProviderApi.v1Create}
                  fields={[
                    {
                      label: 'Tên',
                      name: 'name',
                      type: NKFormType.TEXT,
                      span: 3,
                    },
                    {
                      label: 'Số điện thoại',
                      name: 'phone',
                      type: NKFormType.TEXT,
                      span: 3,
                    },
                    {
                      label: 'Email',
                      name: 'email',
                      type: NKFormType.TEXT,
                      span: 3,
                    },
                    {
                      label: 'Ngày bắt đầu làm việc',
                      name: 'startWorkDate',
                      type: NKFormType.DATE,
                      span: 3,
                    },

                    {
                      label: 'Địa chỉ',
                      name: 'address',
                      type: NKFormType.TEXTAREA,
                      span: 3,
                    },
                  ]}
                  defaultValues={{
                    address: '',
                    email: '',
                    isExternal: false,
                    name: '',
                    phone: '',
                    startWorkDate: nkMoment().format('YYYY-MM-DD'),
                  }}
                  title="Tạo mới nhân viên kỹ thuật"
                  onExtraSuccessAction={(data) => {
                    queryClient.invalidateQueries();
                    close();
                  }}
                  btnLabel="Tạo"
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
              setViewId(id);
            },
          },
          {
            label: 'Chỉnh sửa',
            onClick: (record) => {
              const id = _get(record, 'id');
              setEditId(id);
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
            key: 'id',
            title: 'ID',
            type: FieldType.UUID,
          },
          {
            key: 'name',
            title: 'Tên',
            type: FieldType.TEXT,
          },

          {
            key: 'phone',
            title: 'Số điện thoại',
            type: FieldType.TEXT,
          },

          {
            key: 'startWorkDate',
            title: 'Ngày bắt đầu làm việc',
            type: FieldType.TIME_DATE,
          },
          {
            key: 'status',
            title: 'Trạng thái',
            type: FieldType.BADGE_API,
            apiAction: repairProviderApi.v1GetEnumStatus,
          },
        ]}
        filters={[
          {
            name: 'name',
            label: 'Tên',
            type: NKFormType.TEXT,
            comparator: FilterComparator.LIKE,
          },
          {
            name: 'status',
            label: 'Trạng thái',
            apiAction: repairProviderApi.v1GetEnumStatus,
            type: NKFormType.SELECT_API_OPTION,
            comparator: FilterComparator.EQUAL,
          },
        ]}
      />
    </>
  );
};

export default Page;
