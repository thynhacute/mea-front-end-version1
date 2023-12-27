'use client';

import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { departmentApi } from '@/core/api/department.api';
import { repairRequestApi } from '@/core/api/repair-request.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { NKFormType } from '@/core/components/form/NKForm';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';
import { mapListToOptions, toastError } from '@/core/utils/api.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteOne = useMutation(
    (id: string) => {
      return repairRequestApi.v1Delete(id);
    },
    {
      onSuccess: () => {
        toast.success('Xoá thành công');
        queryClient.invalidateQueries();
      },
      onError: toastError,
    },
  );

  return (
    <>
      <TableBuilder
        sourceKey="repair-request"
        title="Quản lý yêu cầu sửa chữa"
        queryApi={repairRequestApi.v1Get}
        extraButtons={
          <div key="3">
            <Link href={NKRouter.repairRequest.create()}>
              <Button icon={<PlusOutlined rev="" />}>Tạo mới</Button>
            </Link>
          </div>
        }
        actionColumns={[
          {
            label: 'Xem chi tiết',
            onClick: (record) => {
              const id = _get(record, 'id');
              if (id) {
                router.push(NKRouter.repairRequest.detail(id));
              }
            },
          },
          {
            label: 'Chỉnh sửa',
            onClick: (record) => {
              const id = _get(record, 'id');
              if (id) {
                router.push(NKRouter.repairRequest.edit(id));
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
            key: 'imageUrls',
            title: 'Ảnh',
            type: FieldType.FIRST_IMAGES,
          },
          {
            key: 'description',
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
            apiAction: repairRequestApi.v1GetEnumStatus,
          },
          {
            key: 'equipment.name',
            title: 'Thiết bị',
            type: FieldType.TEXT,
          },
        ]}
        filters={[
          // {
          //     name: 'equipment.name',
          //     label: 'Tên thiết bị',
          //     type: NKFormType.TEXT,
          //     comparator: FilterComparator.LIKE,
          //     defaultValue: '',
          // },

          {
            name: 'status',
            label: 'Trạng thái',
            type: NKFormType.SELECT_API_OPTION,
            apiAction: repairRequestApi.v1GetEnumStatus,
            comparator: FilterComparator.LIKE,
            defaultValue: '',
          },
        ]}
      />
    </>
  );
};

export default Page;
