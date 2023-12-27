'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { Button } from 'antd';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { repairRequestApi } from '@/core/api/repair-request.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { RepairRequest } from '@/core/models/repartRequest';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const id = _get(params, 'id') as string;

  const queryData = useQuery(
    ['repair-request', id],
    () => {
      return repairRequestApi.v1GetById(id);
    },
    {},
  );

  const router = useRouter();
  if (queryData.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <FieldBuilder<RepairRequest>
        fields={[
          {
            label: 'Tên thiết bị',
            key: 'equipment.name',
            type: FieldType.TEXT,
            span: 1,
          },

          {
            label: 'Trạng thái',
            key: 'status',
            type: FieldType.BADGE_API,
            apiAction: repairRequestApi.v1GetEnumStatus,
            span: 1,
          },
          {
            key: 'createdBy.name',
            label: 'Người tạo',
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
            key: 'updatedBy.name',
            label: 'Người cập nhật cuối',
            type: FieldType.TEXT,
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
            label: 'Ghi chú',
            key: 'note',
            type: FieldType.MULTILINE_TEXT,
            span: 2,
          },
          {
            label: 'Ảnh',
            key: 'imageUrls',
            type: FieldType.MULTIPLE_IMAGES,
            span: 1,
          },
          {
            label: 'Mô tả',
            key: 'description',
            type: FieldType.MULTILINE_TEXT,
            span: 2,
          },
        ]}
        record={queryData.data}
        extra={
          <div className="flex items-center gap-4">
            <CTAButton
              ctaApi={() => {
                repairRequestApi.v1Delete(id);

                return router;
              }}
              extraOnSuccess={() => {
                router.push(NKRouter.repairRequest.list());
              }}
              isConfirm
            >
              <Button danger>Xoá</Button>
            </CTAButton>

            <Link href={NKRouter.repairRequest.edit(id)}>
              <Button>Chỉnh sửa</Button>
            </Link>
          </div>
        }
        title="Chi tiết yêu cầu sửa chữa"
      />
      {/* <div className="p-4 bg-white rounded-lg">
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            label: 'User Test',
                            key: '2',
                            children: (
                                <>
                                    <Table
                                        dataSource={queryData.data?.users}
                                        className="fade-in"
                                        rowKey="id"
                                        columns={[
                                            {
                                                key: 'id',
                                                title: 'Id',
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
                                                key: 'status',
                                                title: 'Trạng Thái',
                                                render: (record) => {
                                                    const value = _get(record, 'status');
                                                    return <FieldText value={value} />;
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
            </div> */}
    </div>
  );
};

export default Page;
