'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { FieldText } from '@ant-design/pro-components';
import { useQuery } from '@tanstack/react-query';
import { Button, Table, Tabs } from 'antd';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { exportInventoryApi } from '@/core/api/export-inventory';
import { importInventoryApi } from '@/core/api/import-inventory';
import { supplyApi } from '@/core/api/supply.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FieldUuid from '@/core/components/field/FieldUuid';
import { Supply } from '@/core/models/supply';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;

  const queryData = useQuery(
    ['supply', id],
    () => {
      return supplyApi.v1GetById(id);
    },
    {},
  );

  const importInventory = useQuery(
    ['import-inventory-list', id],
    () => {
      return importInventoryApi.v1GetBySupply(id);
    },
    {
      initialData: [],
    },
  );

  const exportInventory = useQuery(
    ['export-inventory-list', id],
    () => {
      return exportInventoryApi.v1GetBySupplyId(id);
    },
    {
      initialData: [],
    },
  );

  if (queryData.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <FieldBuilder<Supply>
        fields={[
          {
            label: 'Tên',
            key: 'name',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            label: 'Mã',
            key: 'code',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            label: 'Trạng thái',
            key: 'status',
            type: FieldType.BADGE_API,
            apiAction: supplyApi.v1GetEnumStatus,
            span: 1,
          },
          {
            label: 'Đơn vị tính',
            key: 'unit',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            label: 'Nhãn hiệu',
            key: 'brand.name',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            label: 'Danh mục vật tư',
            key: 'supplyCategory.name',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            label: 'Danh mục thiết bị',
            key: 'equipmentCategory.name',
            type: FieldType.TEXT,
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
            span: 3,
          },

          {
            label: 'Mô tả',
            key: 'description',
            type: FieldType.MULTILINE_TEXT,
            span: 3,
          },
          {
            label: 'Ảnh',
            key: 'imageUrls',
            type: FieldType.MULTIPLE_IMAGES,
            span: 3,
          },
        ]}
        record={queryData.data}
        extra={
          <div className="flex items-center gap-4">
            <CTAButton
              ctaApi={() => {
                return supplyApi.v1Delete(id);
              }}
              isConfirm
              extraOnSuccess={() => router.push(NKRouter.supply.list())}
            >
              <Button danger>Xoá</Button>
            </CTAButton>

            <Link href={NKRouter.supply.edit(id)}>
              <Button>Chỉnh sửa</Button>
            </Link>
          </div>
        }
        title="Chi tiết vật tư"
      />
      <div className="p-4 bg-white rounded-lg">
        <Tabs
          defaultActiveKey="import"
          items={[
            {
              label: 'Lịch sử nhập kho',
              key: 'import',
              children: (
                <>
                  <Table
                    dataSource={importInventory.data.sort((a, b) => {
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    })}
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
                        key: 'mfDate',
                        title: 'Ngày sản xuất',
                        render: (record) => {
                          const value = _get(record, 'mfDate');
                          return <FieldDisplay value={value} type={FieldType.TIME_DATE} />;
                        },
                      },
                      {
                        key: 'expiredDate',
                        title: 'Ngày hết hạn',
                        render: (record) => {
                          const value = _get(record, 'expiredDate');
                          return <FieldDisplay value={value} type={FieldType.TIME_DATE} />;
                        },
                      },
                      {
                        key: 'quantity',
                        title: 'Số lượng',
                        render: (record) => {
                          const value = _get(record, 'quantity');
                          return <FieldDisplay value={value} type={FieldType.NUMBER} />;
                        },
                      },
                      {
                        key: 'Hết hạn',
                        title: 'Hết hạn',
                        render: (record) => {
                          const expiredDate = _get(record, 'expiredDate');
                          const value = new Date(expiredDate).getTime() < new Date().getTime();
                          console.log(value);
                          return <FieldDisplay value={value} type={FieldType.BOOLEAN} />;
                        },
                      },
                      {
                        key: 'createdAt',
                        title: 'Ngày nhập kho',
                        render: (record) => {
                          const value = _get(record, 'createdAt');
                          return <FieldDisplay value={value} type={FieldType.TIME_DATE} />;
                        },
                      },

                      {
                        key: '',
                        title: '',
                        render: (record) => {
                          const value = _get(record, 'importInventory.id');
                          return (
                            <Link href={NKRouter.importInventory.detail(value)}>
                              <Button>Xem chi tiết</Button>
                            </Link>
                          );
                        },
                      },
                    ]}
                    pagination={false}
                  />
                </>
              ),
            },
            {
              label: 'Lịch sử xuất kho',
              key: 'export',
              children: (
                <>
                  <Table
                    dataSource={exportInventory.data.sort((a, b) => {
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    })}
                    className="fade-in"
                    rowKey="id"
                    columns={[
                      {
                        title: 'Mã',
                        key: 'code',
                        render: (record) => {
                          const value = _get(record, 'code');
                          return <FieldDisplay value={value} type={FieldType.TEXT} />;
                        },
                      },
                      {
                        key: 'quantity',
                        title: 'Số lượng',
                        render: (record) => {
                          const value = record.exportInventoryItems
                            .filter((item: any) => item.supply.id === id)

                            .reduce((acc: any, cur: any) => {
                              return acc + cur.quantity;
                            }, 0);
                          return <FieldDisplay value={value} type={FieldType.NUMBER} />;
                        },
                      },
                      {
                        key: 'createdAt',
                        title: 'Ngày xuất kho',
                        render: (record) => {
                          const value = _get(record, 'createdAt');
                          return <FieldDisplay value={value} type={FieldType.TIME_DATE} />;
                        },
                      },
                      {
                        key: 'status',
                        title: 'Trạng thái',
                        render: (record) => {
                          const value = _get(record, 'status');
                          return <FieldDisplay value={value} type={FieldType.BADGE_API} apiAction={exportInventoryApi.v1GetEnumStatus} />;
                        },
                      },
                      {
                        key: '',
                        title: '',
                        render: (record) => {
                          const value = _get(record, 'id');
                          return (
                            <Link href={NKRouter.exportInventory.detail(value)}>
                              <Button>Xem chi tiết</Button>
                            </Link>
                          );
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
