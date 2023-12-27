'use client';

import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PlusOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Tabs } from 'antd';
import joi from 'joi';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';

import { NKRouter } from '@/core/NKRouter';
import { ImportPlanIV1CreateDto, ImportPlanIV1UpdateDto, importPlanApi } from '@/core/api/import-plan.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { nkMoment } from '@/core/utils/moment';
import { isSame } from '@/core/utils/object.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tabKey, setTabKey] = React.useState('APPROVED');
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const { isInventoryManager, isFacilityManager, isAdmin } = useSelector<RootState, UserState>((state) => state.user);
  const dataQuery = useQuery(['import-plan', editId], () => importPlanApi.v1GetById(editId as string), {
    enabled: !!editId,
  });

  React.useEffect(() => {
    if (isAdmin || isFacilityManager) {
      setTabKey('SUBMITTED');
    }
  }, [isFacilityManager, isAdmin]);

  const statusList = useQuery(
    ['import-plan-status', isInventoryManager, isFacilityManager, isAdmin],
    async () => {
      let res = await importPlanApi.v1GetEnumStatus();
      if (!isAdmin && !isFacilityManager) {
        res = res.filter((item) => item.id !== 'SUBMITTED');
      }

      if (isInventoryManager) {
        res = res.filter((item) => item.id === 'SUBMITTED' || item.id === 'APPROVED' || item.id === 'COMPLETED');
      }

      return res;
    },
    {
      initialData: [],
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  const handleEdit = (id: string) => {
    setEditId(id);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditId(null);
  };

  const userState = useSelector<RootState, UserState>((state) => state.user);

  return (
    <>
      <Modal open={openEditModal} footer={null} onCancel={() => handleCloseEditModal()}>
        {Boolean(dataQuery.data && editId) && (
          <FormBuilder<ImportPlanIV1UpdateDto>
            apiAction={(dto) => {
              if (!editId) {
                return Promise.reject();
              }

              return importPlanApi.v1Update(editId, dto);
            }}
            schema={{
              startImportDate: joi.any(),
              endImportDate: joi.any(),
              name: joi.any(),
            }}
            fields={[
              {
                label: 'Tên',
                name: 'name',
                type: NKFormType.TEXT,
                span: 3,
              },
              {
                label: 'Ngày bắt đầu nhập kho',
                name: 'startImportDate',
                type: NKFormType.DATE,
                span: 3,
              },
              {
                label: 'Ngày kết thúc nhập kho',
                name: 'endImportDate',
                type: NKFormType.DATE,
                span: 3,
              },
            ]}
            defaultValues={{
              startImportDate: dataQuery.data?.startImportDate || nkMoment().format('YYYY-MM-DD'),
              endImportDate: dataQuery.data?.endImportDate || nkMoment().format('YYYY-MM-DD'),
              name: dataQuery.data?.name || '',
            }}
            title="Cập nhật kế hoạch mua sắm"
            onExtraSuccessAction={() => {
              queryClient.invalidateQueries();
              handleCloseEditModal();
            }}
            btnLabel="Cập nhật"
          />
        )}
      </Modal>
      <div>
        <div className="mb-2 text-2xl font-bold">Quản lý kế hoạch mua sắm</div>
        <div className="relative">
          <div className="absolute z-20 top-1">
            <Tabs
              type="card"
              activeKey={tabKey}
              onChange={(key) => {
                setTabKey(key);
              }}
              items={
                isFacilityManager
                  ? [
                      ...statusList.data
                        .map((item) => ({
                          key: item.id,
                          label: item.name,
                        }))
                        .filter((item) => item.key !== 'DRAFT'),
                      {
                        key: '',
                        label: 'Tất cả',
                      },
                    ]
                  : [
                      ...statusList.data
                        .filter((item) => item.value !== 'SUBMITTED')
                        .map((item) => ({
                          key: item.id,
                          label: item.name,
                        })),
                      {
                        key: '',
                        label: 'Tất cả',
                      },
                    ]
              }
            />
          </div>

          <TableBuilder
            sourceKey="importPlan"
            title=""
            queryApi={importPlanApi.v1Get}
            extraFilter={
              tabKey
                ? [`status||${FilterComparator.EQUAL}||${tabKey}`]
                : isInventoryManager
                ? [`status||${FilterComparator.IN}||APPROVED,COMPLETED`]
                : []
            }
            extraButtons={
              <div key="3">
                {userState.isFacilityManager && (
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
                      <FormBuilder<ImportPlanIV1CreateDto>
                        apiAction={importPlanApi.v1Create}
                        schema={{
                          endImportDate: joi.any(),
                          startImportDate: joi.any(),
                          name: joi.any(),
                        }}
                        fields={[
                          {
                            label: 'Tên',
                            name: 'name',
                            type: NKFormType.TEXT,
                            span: 3,
                          },

                          {
                            label: 'Ngày bắt đầu nhập kho',
                            name: 'startImportDate',
                            type: NKFormType.DATE,
                            span: 3,
                          },
                          {
                            label: 'Ngày kết thúc nhập kho',
                            name: 'endImportDate',
                            type: NKFormType.DATE,
                            span: 3,
                          },
                        ]}
                        defaultValues={{
                          startImportDate: nkMoment().format('YYYY-MM-DD'),
                          endImportDate: nkMoment().format('YYYY-MM-DD'),
                          name: '',
                        }}
                        title="Tạo kế hoạch mua sắm"
                        onExtraSuccessAction={(data) => {
                          queryClient.invalidateQueries();
                          router.push(NKRouter.importPlan.detail(_get(data, 'id')));
                          close();
                        }}
                        btnLabel="Tạo"
                      />
                    )}
                  </ModalBuilder>
                )}
              </div>
            }
            actionColumns={[
              {
                label: 'Xem chi tiết',
                onClick: (record) => {
                  const id = _get(record, 'id');
                  if (id) {
                    router.push(NKRouter.importPlan.detail(id));
                  }
                },
              },

              {
                isShow: (record) => {
                  const status = _get(record, 'status');
                  return isSame(status, 'DRAFT');
                },
                label: 'Chỉnh sửa',
                onClick: (record) => {
                  const id = _get(record, 'id');
                  if (id) {
                    handleEdit(id);
                  }
                },
              },

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
                key: 'documentNumber',
                title: 'Số chứng từ',
                type: FieldType.TEXT,
              },
              // {
              //   key: 'contractSymbol',
              //   title: 'Ký hiệu hoá đơn',
              //   type: FieldType.TEXT,
              // },
              {
                key: 'name',
                title: 'Tên',
                type: FieldType.TEXT,
              },
              {
                key: 'startImportDate',
                title: 'Ngày bắt đầu nhập kho',
                type: FieldType.TIME_DATE,
              },
              {
                key: 'endImportDate',
                title: 'Ngày kết thúc nhập kho',
                type: FieldType.TIME_DATE,
              },
              {
                key: 'createdAt',
                title: 'Ngày tạo',
                type: FieldType.TIME_DATE,
              },
              {
                key: 'status',
                title: 'Trạng thái',
                type: FieldType.BADGE_API,
                apiAction: importPlanApi.v1GetEnumStatus,
              },
            ]}
            filters={[
              {
                name: 'code',
                label: 'Mã',
                type: NKFormType.TEXT,
                comparator: FilterComparator.LIKE,
              },
              {
                name: 'documentNumber',
                label: 'Số chứng từ',
                type: NKFormType.TEXT,
                comparator: FilterComparator.LIKE,
              },
              {
                name: 'contractSymbol',
                label: 'Ký hiệu hoá đơn',
                type: NKFormType.TEXT,
                comparator: FilterComparator.LIKE,
              },
              {
                name: 'status',
                label: 'Trạng thái',
                apiAction: importPlanApi.v1GetEnumStatus,
                type: NKFormType.SELECT_API_OPTION,
                comparator: FilterComparator.EQUAL,
              },
              {
                name: 'startImportDate',
                comparator: FilterComparator.GREATER_THAN_OR_EQUAL,
                label: 'Ngày bắt đầu nhập kho',
                type: NKFormType.DATE_TIME,
              },
              {
                name: 'endImportDate',
                label: 'Ngày kết thúc nhập kho',
                comparator: FilterComparator.LESS_THAN_OR_EQUAL,
                type: NKFormType.DATE_TIME,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
