'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { Button, Table, Tabs } from 'antd';
import joi from 'joi';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';

import { NKRouter } from '@/core/NKRouter';
import { brandApi } from '@/core/api/brand.api';
import { DepartmentIV1UpdateDto, departmentApi } from '@/core/api/department.api';
import { equipmentCategoryApi } from '@/core/api/equipment-category.api';
import { equipmentStatusApi } from '@/core/api/equipment-status.api';
import { equipmentApi } from '@/core/api/equipment.api';
import { exportInventoryApi } from '@/core/api/export-inventory';
import { supplyCategoryApi } from '@/core/api/supply-category.api';
import { supplyApi } from '@/core/api/supply.api';
import { userAdminApi } from '@/core/api/user-admin.api';
import { userApi } from '@/core/api/user.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBadgeApi from '@/core/components/field/FieldBadgeApi';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FieldImage from '@/core/components/field/FieldImage';
import FieldLinkButton from '@/core/components/field/FieldLinkButton';
import FieldNumber from '@/core/components/field/FieldNumber';
import FieldText from '@/core/components/field/FieldText';
import FieldUuid from '@/core/components/field/FieldUuid';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { FilterComparator, SortOrder } from '@/core/models/common';
import { Department } from '@/core/models/department';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { mapListToOptions } from '@/core/utils/api.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;
  const userStoreState = useSelector<RootState, UserState>((state) => state.user);

  const queryData = useQuery(
    ['department', id],
    () => {
      return departmentApi.v1GetById(id);
    },
    {},
  );

  const equipmentQuery = useQuery(
    ['equipment', id],
    () => {
      return equipmentApi.v1GetByDepartment(id, {
        filters: [],
        orderBy: [],
        page: 0,
        pageSize: 99999999,
      });
    },
    {},
  );

  const supplyQuery = useQuery(
    ['supply', id],
    () => {
      return exportInventoryApi.v1GetSupplyByDepartment(id);
    },
    {
      initialData: [],
    },
  );

  if (queryData.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <FieldBuilder<Department>
        fields={[
          {
            label: 'Tên',
            key: 'name',
            type: FieldType.TEXT,
            span: 2,
          },

          {
            label: 'Trạng thái',
            key: 'status',
            type: FieldType.BADGE_API,
            apiAction: departmentApi.v1GetEnumStatus,
            span: 1,
          },
          {
            label: 'Ngày tạo',
            key: 'createdAt',
            type: FieldType.TIME_FULL,
            span: 1,
          },

          {
            label: 'Ngày cập nhật',
            key: 'updatedAt',
            type: FieldType.TIME_FULL,
            span: 1,
          },

          {
            label: 'Bị xóa',
            key: 'isDeleted',
            type: FieldType.BOOLEAN,
            span: 1,
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
            {userStoreState.isMaintenanceManager && userStoreState.isAdmin && (
              <>
                <CTAButton
                  ctaApi={() => {
                    return departmentApi.v1Delete(id);
                  }}
                  isConfirm
                  extraOnSuccess={() => router.push(NKRouter.department.list())}
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
                    <FormBuilder<DepartmentIV1UpdateDto>
                      apiAction={(dto) => {
                        return departmentApi.v1Update(id, dto);
                      }}
                      schema={{
                        name: joi.any(),
                        description: joi.any(),
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
                          label: 'Mô tả',
                          name: 'description',
                          type: NKFormType.TEXTAREA,
                          span: 3,
                        },
                        {
                          label: 'Trạng thái',
                          name: 'status',
                          type: NKFormType.SELECT_API_OPTION,
                          span: 3,
                          useAction: departmentApi.v1GetEnumStatus,
                        },
                      ]}
                      defaultValues={{
                        name: queryData.data?.name || '',
                        description: queryData.data?.description || '',
                        status: queryData.data?.status || '',
                      }}
                      title="Cập nhật phòng ban"
                      onExtraSuccessAction={() => {
                        close();
                        queryData.refetch();
                      }}
                      btnLabel="Cập nhật"
                    />
                  )}
                </ModalBuilder>
              </>
            )}
          </div>
        }
        title="Chi tiết phòng ban"
      />
      <div className="p-4 bg-white rounded-lg">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: 'Danh sách nhân viên',
              key: 'user',
              children: (
                <>
                  <Table
                    dataSource={queryData.data?.users}
                    className="fade-in"
                    rowKey="id"
                    columns={[
                      {
                        key: 'id',
                        title: 'ID',
                        render: (record) => {
                          const value = _get(record, 'id');
                          return <FieldUuid value={value} />;
                        },
                      },
                      {
                        key: 'name',
                        title: 'Tên',
                        render: (record) => {
                          const value = _get(record, 'name');
                          return <FieldText value={value} />;
                        },
                      },
                      {
                        key: 'email',
                        title: 'Email',
                        render: (record) => {
                          const value = _get(record, 'email');
                          return <FieldText value={value} />;
                        },
                      },
                      {
                        key: 'gender',
                        title: 'Giới tính',
                        render: (record) => {
                          const value = _get(record, 'gender');
                          return <FieldBadgeApi value={value} apiAction={userApi.v1GetEnumGender} />;
                        },
                      },
                      {
                        key: 'status',
                        title: 'Trạng Thái',
                        render: (record) => {
                          const value = _get(record, 'status');
                          return <FieldBadgeApi value={value} apiAction={userApi.v1GetEnumStatus} />;
                        },
                      },
                      {
                        key: 'detail',
                        title: '',
                        render: (record) => {
                          const value = _get(record, 'id');
                          return <FieldLinkButton value={NKRouter.user.user.detail(value)} label="Chi tiết" />;
                        },
                      },
                    ]}
                    pagination={false}
                  />
                </>
              ),
            },
            {
              label: 'Danh sách thiết bị',
              key: 'equipment',
              children: (
                <>
                  <Table
                    dataSource={equipmentQuery?.data || []}
                    className="fade-in"
                    rowKey="id"
                    columns={[
                      {
                        key: 'imageUrls',
                        title: 'Ảnh',
                        render: (record) => {
                          const value = _get(record, 'imageUrls');
                          return <FieldImage src={value[0]} className="max-w-[100px]" />;
                        },
                      },
                      {
                        key: 'name',
                        title: 'Tên',
                        render: (record) => {
                          const value = _get(record, 'name');
                          return <FieldText value={value} />;
                        },
                      },
                      {
                        key: 'code',
                        title: 'Mã',
                        render: (record) => {
                          const value = _get(record, 'code');
                          return <FieldText value={value} />;
                        },
                      },
                      {
                        key: 'currentStatus',
                        title: 'Trạng thái hiện tại',
                        render: (record) => {
                          const value = _get(record, 'currentStatus');
                          return (
                            <FieldBadgeApi
                              value={value}
                              apiAction={async () => {
                                const res = await equipmentStatusApi.v1GetEnumStatus();

                                return res;
                              }}
                            />
                          );
                        },
                      },
                      {
                        key: 'equipmentCategory',
                        title: 'Danh mục thiết bị',
                        render: (record) => {
                          const value = _get(record, 'equipmentCategory.id');
                          return <FieldBadgeApi value={value} apiAction={async () => mapListToOptions(await equipmentCategoryApi.v1GetSelect(''))} />;
                        },
                      },
                      {
                        key: 'brand',
                        title: 'Nhãn hiệu',
                        render: (record) => {
                          const value = _get(record, 'brand.id');
                          return <FieldBadgeApi value={value} apiAction={async () => mapListToOptions(await brandApi.v1GetSelect(''))} />;
                        },
                      },
                      {
                        key: 'detail',
                        title: '',
                        render: (record) => {
                          const value = _get(record, 'id');
                          return <FieldLinkButton value={NKRouter.equipment.detail(value)} label="Chi tiết" />;
                        },
                      },
                    ]}
                    pagination={false}
                  />
                </>
              ),
            },
            {
              label: 'Danh sách vật tư',
              key: 'supply',
              children: (
                <>
                  <Table
                    dataSource={supplyQuery?.data || []}
                    className="fade-in"
                    rowKey="id"
                    columns={[
                      {
                        key: 'imageUrls',
                        title: 'Ảnh',
                        render: (record) => {
                          const value = _get(record, 'imageUrls');
                          return <FieldImage src={value[0]} className="max-w-[100px]" />;
                        },
                      },
                      {
                        key: 'name',
                        title: 'Tên',
                        render: (record) => {
                          const value = _get(record, 'name');
                          return <FieldText value={value} />;
                        },
                      },
                      {
                        key: 'code',
                        title: 'Mã',
                        render: (record) => {
                          const value = _get(record, 'code');
                          return <FieldText value={value} />;
                        },
                      },
                      {
                        key: 'quantity',
                        title: 'Số Lượng',
                        render: (record) => {
                          const value = _get(record, 'quantity') || 0;
                          return <FieldNumber value={value} />;
                        },
                      },

                      {
                        key: 'equipmentCategory',
                        title: 'Danh mục vật tư',
                        render: (record) => {
                          const value = _get(record, 'supplyCategory.id');

                          return <FieldBadgeApi value={value} apiAction={async () => mapListToOptions(await supplyCategoryApi.v1GetSelect(''))} />;
                        },
                      },
                      {
                        key: 'brand',
                        title: 'Nhãn hiệu',
                        render: (record) => {
                          const value = _get(record, 'brand.id');
                          return <FieldBadgeApi value={value} apiAction={async () => mapListToOptions(await brandApi.v1GetSelect(''))} />;
                        },
                      },
                      {
                        key: 'detail',
                        title: '',
                        render: (record) => {
                          const value = _get(record, 'id');
                          return <FieldLinkButton value={NKRouter.supply.detail(value)} label="Chi tiết" />;
                        },
                      },
                    ]}
                    pagination={false}
                  />
                </>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Page;
