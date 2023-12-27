'use client';

import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PlusOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Tabs } from 'antd';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';

import { NKRouter } from '@/core/NKRouter';
import { exportInventoryApi } from '@/core/api/export-inventory';
import { ImportInventoryIV1CreateDto, ImportInventoryIV1UpdateDto, importInventoryApi } from '@/core/api/import-inventory';
import { importPlanApi } from '@/core/api/import-plan.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { addNoSelectOption, mapListToOptions } from '@/core/utils/api.helper';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tabKey, setTabKey] = React.useState('');
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const { isInventoryManager } = useSelector<RootState, UserState>((state) => state.user);

  const [editId, setEditId] = React.useState<string | null>(null);
  const dataQuery = useQuery(['import-inventory', editId], () => importInventoryApi.v1GetById(editId as string), {
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

  const statusList = useQuery(
    ['import-inventory-status', isInventoryManager],
    async () => {
      let res = await importInventoryApi.v1GetEnumStatus();

      return res;
    },
    {
      initialData: [],
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <>
      <Modal open={openEditModal} footer={null} onCancel={() => handleCloseEditModal()}>
        {Boolean(dataQuery.data && editId) && (
          <FormBuilder<ImportInventoryIV1UpdateDto>
            apiAction={(data) => {
              if (!editId) {
                return Promise.reject();
              }
              return importInventoryApi.v1Update(editId, data);
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
                name: 'note',
                type: NKFormType.TEXTAREA,
                span: 3,
              },
              // {
              //     label: 'Ngày nhập kho',
              //     name: 'importDate',
              //     type: NKFormType.DATE,
              //     span: 3,
              // },
              // {
              //   label: 'Kế hoạch mua sắm',
              //   name: 'importPlanId',
              //   type: NKFormType.SELECT_API_OPTION,
              //   apiAction: async (data) => {
              //     const res = await importPlanApi.v1GetSelect(data);

              //     return addNoSelectOption(
              //       mapListToOptions(
              //         res.filter((item) => item.status === 'APPROVED'),
              //         'code',
              //       ),
              //     );
              //   },
              //   span: 3,
              // },
            ]}
            defaultValues={{
              importDate: nkMoment(dataQuery.data?.importDate).format('YYYY-MM-DD') || nkMoment().format('YYYY-MM-DD'),
              importPlanId: dataQuery.data?.importPlan?.id || '',
              name: dataQuery.data?.name || '',
              note: dataQuery.data?.note || '',
            }}
            title="Cập nhật phiếu nhập kho"
            onExtraSuccessAction={() => {
              queryClient.invalidateQueries();
              handleCloseEditModal();
            }}
            btnLabel="Cập nhật"
          />
        )}
      </Modal>
      <div>
        <div className="mb-2 text-2xl font-bold">Quản lý nhập kho</div>
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
        </div>
        <TableBuilder
          sourceKey="importInventories"
          title=""
          queryApi={importInventoryApi.v1Get}
          extraFilter={tabKey ? [`status||${FilterComparator.EQUAL}||${tabKey}`] : []}
          extraButtons={
            <div key="3">
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
                  <FormBuilder<ImportInventoryIV1CreateDto>
                    apiAction={importInventoryApi.v1Create}
                    fields={[
                      {
                        label: 'Tên',
                        name: 'name',
                        type: NKFormType.TEXT,
                        span: 3,
                      },
                      {
                        label: 'Mô tả',
                        name: 'note',
                        type: NKFormType.TEXTAREA,
                        span: 3,
                      },
                      // {
                      //     label: 'Ngày nhập kho',
                      //     name: 'importDate',
                      //     type: NKFormType.DATE,
                      //     span: 3,
                      // },
                      {
                        label: 'Kế hoạch mua sắm',
                        name: 'importPlanId',
                        type: NKFormType.SELECT_API_OPTION,
                        useAction: async (data) => {
                          const res = await importPlanApi.v1GetSelect(data);

                          return addNoSelectOption(
                            mapListToOptions(
                              res.filter((item) => item.status === 'APPROVED'),
                              'code',
                            ),
                          );
                        },
                        span: 3,
                      },
                    ]}
                    defaultValues={{
                      importDate: nkMoment().format('YYYY-MM-DD'),
                      importPlanId: '',
                      name: '',
                      note: '',
                    }}
                    title="Tạo phiếu nhập kho"
                    onExtraSuccessAction={(data) => {
                      const id = _get(data, 'id');
                      router.push(NKRouter.importInventory.detail(id));
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
                if (id) {
                  router.push(NKRouter.importInventory.detail(id));
                }
              },
            },
            {
              isShow: (record) => {
                const status = _get(record, 'status');
                return status === 'DRAFT';
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
              key: 'name',
              title: 'Tên',
              type: FieldType.TEXT,
            },
            {
              key: 'documentNumber',
              title: 'Số chứng từ',
              type: FieldType.TEXT,
            },
            {
              key: 'contractSymbol',
              title: 'Ký hiệu hoá đơn',
              type: FieldType.TEXT,
            },

            {
              key: 'importDate',
              title: 'Ngày nhập kho',
              type: FieldType.TIME_DATE,
            },

            {
              key: 'status',
              title: 'Trạng thái',
              type: FieldType.BADGE_API,
              apiAction: importInventoryApi.v1GetEnumStatus,
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
              apiAction: importInventoryApi.v1GetEnumStatus,
              type: NKFormType.SELECT_API_OPTION,
              comparator: FilterComparator.EQUAL,
            },
          ]}
        />
      </div>
    </>
  );
};

export default Page;
