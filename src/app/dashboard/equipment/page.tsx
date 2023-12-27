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
import { brandApi } from '@/core/api/brand.api';
import { departmentApi } from '@/core/api/department.api';
import { equipmentCategoryApi } from '@/core/api/equipment-category.api';
import { equipmentStatusApi } from '@/core/api/equipment-status.api';
import { equipmentApi } from '@/core/api/equipment.api';
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
      return equipmentApi.v1Delete(id);
    },
    {
      onSuccess: () => {
        toast.success('Xoá thành công');
        queryClient.invalidateQueries();
      },
      onError: toastError,
    },
  );

  React.useEffect(() => {
    equipmentApi.v1Get({
      filters: [],
      orderBy: [],
      page: 0,
      pageSize: 10,
    });
  }, []);

  return (
    <>
      <TableBuilder
        sourceKey="equipment"
        title="Quản lý thiết bị"
        queryApi={equipmentApi.v1Get}
        extraButtons={
          <div key="3">
            {/* <Link href={NKRouter.equipment.create()}>
                            <Button icon={<PlusOutlined rev="" />}>Tạo mới</Button>
                        </Link> */}
          </div>
        }
        actionColumns={[
          {
            label: 'Xem chi tiết',
            onClick: (record) => {
              const id = _get(record, 'id');
              if (id) {
                router.push(NKRouter.equipment.detail(id));
              }
            },
          },
          {
            label: 'Chỉnh sửa',
            onClick: (record) => {
              const id = _get(record, 'id');
              if (id) {
                router.push(NKRouter.equipment.edit(id));
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
            key: 'currentStatus',
            title: 'Trạng thái',
            type: FieldType.BADGE_API,
            apiAction: equipmentStatusApi.v1GetEnumStatus,
          },
          {
            key: 'equipmentCategory.id',
            title: 'Danh mục thiết bị',
            type: FieldType.BADGE_API,

            apiAction: async () => mapListToOptions(await equipmentCategoryApi.v1GetSelect('')),
          },
          {
            key: 'brand.id',
            title: 'Thương hiệu',
            type: FieldType.BADGE_API,
            apiAction: async () => mapListToOptions(await brandApi.v1GetSelect('')),
          },
          {
            key: 'department.id',
            title: 'Phòng ban',
            type: FieldType.BADGE_API,
            apiAction: async () => {
              const res = await mapListToOptions(await departmentApi.v1GetSelect(''));

              return res;
            },
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
            name: 'department.id',
            label: 'Phòng ban',
            type: NKFormType.SELECT_API_OPTION,
            comparator: FilterComparator.EQUAL,
            apiAction: async (data) => mapListToOptions(await departmentApi.v1GetSelect(data)),
          },
        ]}
      />
    </>
  );
};

export default Page;
