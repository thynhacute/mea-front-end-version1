'use client';

import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Tabs } from 'antd';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { departmentApi } from '@/core/api/department.api';
import { exportInventoryApi } from '@/core/api/export-inventory';
import { RepairReportIV1CreateDto, repairReportApi } from '@/core/api/repair-report.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { mapListToOptions, toastError } from '@/core/utils/api.helper';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tabKey, setTabKey] = React.useState('REQUESTING');
  const userState = useSelector<RootState, UserState>((state) => state.user);
  const deleteOne = useMutation(
    (id: string) => {
      return repairReportApi.v1Delete(id);
    },
    {
      onSuccess: () => {
        toast.success('Xoá thành công');
        queryClient.invalidateQueries();
      },
      onError: toastError,
    },
  );

  const statusList = useQuery(
    ['repair-report-status'],
    () => {
      return repairReportApi.v1GetEnumStatus();
    },
    {
      initialData: [],
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <>
      <div>
        <div className="mb-2 text-2xl font-bold">Báo cáo sửa chữa</div>
        <div className="relative">
          <div className="absolute z-20 top-1">
            <Tabs
              type="card"
              activeKey={tabKey}
              onChange={(key) => {
                setTabKey(key);
              }}
              items={[
                {
                  key: '',
                  label: 'Tất cả',
                },
                ...statusList.data.map((item) => ({
                  key: item.id,
                  label: item.name,
                })),
              ]}
            />
          </div>

          <TableBuilder
            sourceKey="repairReport"
            title=""
            extraFilter={tabKey ? [`status||${FilterComparator.EQUAL}||${tabKey}`] : []}
            queryApi={repairReportApi.v1Get}
            extraButtons={
              <div key="3">
                {userState.isMaintenanceManager && (
                  <>
                    <ModalBuilder
                      btnLabel="Tạo mới "
                      modalTitle={``}
                      btnProps={{
                        size: 'middle',
                        type: 'default',
                        icon: <PlusOutlined rev="" />,
                      }}
                    >
                      {(close) => (
                        <FormBuilder<RepairReportIV1CreateDto>
                          apiAction={repairReportApi.v1Create}
                          fields={[
                            {
                              label: 'Ngày bắt đầu',
                              name: 'startAt',
                              type: NKFormType.DATE,
                              span: 3,
                            },
                            {
                              label: 'Ngày kết thúc',
                              name: 'endAt',
                              type: NKFormType.DATE,
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
                            description: '',
                            repairReportItems: [],
                            endAt: nkMoment().format('YYYY-MM-DD'),
                            note: '',
                            price: 0,
                            startAt: nkMoment().format('YYYY-MM-DD'),
                            brokenDate: null,
                          }}
                          title="Tạo mới lịch bảo trì"
                          onExtraSuccessAction={(data) => {
                            const repairReportId = _get(data, 'id');
                            if (repairReportId) {
                              router.push(NKRouter.repairReport.detail(repairReportId));
                            }
                            close();
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
                    router.push(NKRouter.repairReport.detail(id));
                  }
                },
              },
              // {
              //   label: 'Chỉnh sửa',
              //   onClick: (record) => {
              //     const id = _get(record, 'id');
              //     if (id) {
              //       router.push(NKRouter.repairReport.edit(id));
              //     }
              //   },
              // },
              // {
              //     label: 'Xoá',
              //     onClick: (record) => {
              //         const id = _get(record, 'id');
              //         if (id) {
              //             deleteOne.mutate(id);
              //         }
              //     },
              // },
            ]}
            columns={[
              {
                key: 'code',
                title: 'Mã',
                type: FieldType.TEXT,
              },
              {
                key: 'status',
                title: 'Trạng thái',
                type: FieldType.BADGE_API,
                apiAction: repairReportApi.v1GetEnumStatus,
              },
              {
                key: 'startAt',
                title: 'Ngày bắt đầu',
                type: FieldType.TIME_DATE,
              },
              {
                key: 'endAt',
                title: 'Ngày kết thúc',
                type: FieldType.TIME_DATE,
              },
              {
                key: 'createdAt',
                title: 'Ngày tạo',
                type: FieldType.TIME_FULL,
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
                name: 'code',
                label: 'Mã',
                type: NKFormType.TEXT,
                comparator: FilterComparator.LIKE,
              },
              {
                name: 'status',
                label: 'Trạng thái',
                apiAction: repairReportApi.v1GetEnumStatus,
                type: NKFormType.SELECT_API_OPTION,
                comparator: FilterComparator.EQUAL,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
