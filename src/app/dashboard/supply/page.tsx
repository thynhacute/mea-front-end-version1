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
import { supplyCategoryApi } from '@/core/api/supply-category.api';
import { supplyApi } from '@/core/api/supply.api';
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
      return supplyApi.v1Delete(id);
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
    supplyApi.v1Get({
      filters: [],
      orderBy: [],
      page: 0,
      pageSize: 10,
    });
  }, []);

  return (
    <>
      <TableBuilder
        sourceKey="supply"
        title="Quản lý Vật Tư"
        queryApi={supplyApi.v1Get}
        extraButtons={
          <div key="3">
            <Link href={NKRouter.supply.create()}>
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
                router.push(NKRouter.supply.detail(id));
              }
            },
          },
          {
            label: 'Chỉnh sửa',
            onClick: (record) => {
              const id = _get(record, 'id');
              if (id) {
                router.push(NKRouter.supply.edit(id));
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
            key: 'quantity',
            title: 'Số Lượng',
            type: FieldType.NUMBER,
          },
          {
            key: 'brand.id',
            title: 'Thương hiệu',
            type: FieldType.BADGE_API,
            apiAction: async () => mapListToOptions(await brandApi.v1GetSelect('')),
          },
          {
            key: 'supplyCategory.id',
            title: 'Danh mục vật tư',
            type: FieldType.BADGE_API,
            apiAction: async () => mapListToOptions(await supplyCategoryApi.v1GetSelect('')),
          },

          {
            key: 'quantityStatus',
            title: 'Trạng thái',
            type: FieldType.BADGE_API,
            apiAction: supplyApi.v1GetEnumQuantityStatus,
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
            apiAction: supplyApi.v1GetEnumStatus,
            comparator: FilterComparator.LIKE,
            defaultValue: '',
          },
        ]}
      />
    </>
  );
};

export default Page;
