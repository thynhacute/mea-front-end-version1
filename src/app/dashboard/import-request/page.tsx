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
import { ImportRequestIV1CreateDto, ImportRequestIV1UpdateDto, importRequestApi } from '@/core/api/import-request';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { mapListToOptions } from '@/core/utils/api.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isInventoryManager, isFacilityManager, isAdmin } = useSelector<RootState, UserState>((state) => state.user);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [tabKey, setTabKey] = React.useState('');
  const [editId, setEditId] = React.useState<string | null>(null);
  const dataQuery = useQuery(['import-request', editId], () => importRequestApi.v1GetById(editId as string), {
    enabled: !!editId,
  });

  React.useEffect(() => {
    if (isFacilityManager) {
      setTabKey('REQUESTING');
    }
  }, [isFacilityManager]);

  React.useEffect(() => {
    if (isInventoryManager) {
      setTabKey('UPDATED');
    }
  }, [isInventoryManager]);

  const handleEdit = (id: string) => {
    setEditId(id);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditId(null);
  };

  const statusList = useQuery(
    ['import-request-status', isInventoryManager, isFacilityManager],
    async () => {
      let res = await importRequestApi.v1GetEnumStatus();

      if (isInventoryManager && !isAdmin) {
        res = res.filter((item) => item.id === 'UPDATED' || item.id === 'APPROVED' || item.id === 'COMPLETED');
      }

      if (isFacilityManager && !isAdmin) {
        res = res.filter((item) => item.id !== 'DRAFT');
      }

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
          <FormBuilder<ImportRequestIV1UpdateDto>
            apiAction={(data) => {
              if (!editId) {
                return Promise.reject();
              }

              return importRequestApi.v1Update(editId, data);
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
                label: 'Phòng ban',
                name: 'departmentId',
                type: NKFormType.SELECT_API_OPTION,
                useAction: departmentApi.v1GetSelect,
                span: 3,
              },
              {
                label: 'Thời gian dự kiến',
                name: 'expected',
                type: NKFormType.SELECT_API_OPTION,
                useAction: importRequestApi.v1GetEnumExpected,
                span: 3,
              },
            ]}
            defaultValues={{
              name: dataQuery.data?.name || '',
              description: dataQuery.data?.description || '',
              departmentId: dataQuery.data?.department?.id || '',
              expected: dataQuery.data?.expected || '',
            }}
            title="Cập nhật yêu cầu đặt thiết bị"
            onExtraSuccessAction={() => {
              handleCloseEditModal();
              queryClient.invalidateQueries();
            }}
            btnLabel="Cập nhật"
          />
        )}
      </Modal>
      <div>
        <div className="mb-2 text-2xl font-bold">Quản lý yêu cầu đặt thiết bị</div>
        <div className="relative">
          <div className="absolute z-20 top-1">
            <Tabs
              type="card"
              activeKey={tabKey}
              onChange={(key) => {
                setTabKey(key);
              }}
              items={[
                ...statusList.data.map((item) => ({
                  key: item.id,
                  label: item.name,
                })),
                {
                  key: '',
                  label: 'Tất cả',
                },
              ]}
            />
          </div>

          <TableBuilder
            sourceKey="importRequest"
            title=""
            queryApi={importRequestApi.v1Get}
            extraFilter={
              tabKey
                ? [`status||${FilterComparator.EQUAL}||${tabKey}`]
                : isInventoryManager
                ? [`status||${FilterComparator.IN}||UPDATED,APPROVED`]
                : []
            }
            extraButtons={
              <div key="3">
                {isFacilityManager && (
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
                      <FormBuilder<ImportRequestIV1CreateDto>
                        apiAction={importRequestApi.v1Create}
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
                            label: 'Phòng ban',
                            name: 'departmentId',
                            type: NKFormType.SELECT_API_OPTION,
                            useAction: departmentApi.v1GetSelect,
                            span: 3,
                          },
                          {
                            label: 'Thời gian dự kiến',
                            name: 'expected',
                            type: NKFormType.SELECT_API_OPTION,
                            useAction: importRequestApi.v1GetEnumExpected,
                            span: 3,
                          },
                        ]}
                        defaultValues={{
                          name: '',
                          description: '',
                          departmentId: '',
                          expected: '',
                          importRequestItems: [],
                        }}
                        title="Tạo yêu cầu đặt thiết bị"
                        onExtraSuccessAction={async (data) => {
                          const id = _get(data, 'id');
                          await importRequestApi.v1UpdateSubmit(id).then(() => {
                            router.push(NKRouter.importRequest.detail(id));
                          });
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
                    router.push(NKRouter.importRequest.detail(id));
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
                key: 'department.id',
                title: 'Phòng ban',
                type: FieldType.BADGE_API,
                apiAction: async () => mapListToOptions(await departmentApi.v1GetSelect('')),
              },
              {
                key: 'createdAt',
                title: 'Ngày Tạo',
                type: FieldType.TIME_FULL,
              },
              {
                key: 'status',
                title: 'Trạng thái',
                type: FieldType.BADGE_API,
                apiAction: importRequestApi.v1GetEnumStatus,
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
                name: 'department.id',
                label: 'Phòng ban',
                type: NKFormType.SELECT_API_OPTION,
                apiAction: departmentApi.v1GetSelect,
                comparator: FilterComparator.EQUAL,
              },

              {
                name: 'status',
                label: 'Trạng thái',
                apiAction: importRequestApi.v1GetEnumStatus,
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
