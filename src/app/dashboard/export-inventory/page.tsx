'use client';

import * as React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from 'antd';
import { Tabs } from 'antd';
import _get from 'lodash/get';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { departmentApi } from '@/core/api/department.api';
import { ExportInventoryIV1CreateDto, ExportInventoryIV1UpdateDto, exportInventoryApi } from '@/core/api/export-inventory';
import { importRequestApi } from '@/core/api/import-request';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import NKForm, { NKFormType } from '@/core/components/form/NKForm';
import NKFormWrapper from '@/core/components/form/NKFormWrapper';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { FilterComparator } from '@/core/models/common';
import { ImportRequest } from '@/core/models/importRequest';
import { addNoSelectOption, mapListToOptions } from '@/core/utils/api.helper';
import { nkMoment } from '@/core/utils/moment';

interface CreateFormProps {
  close: () => void;
}
interface PageProps {}

const CreateForm = ({ close }: CreateFormProps) => {
  const router = useRouter();
  const [importRequest, setImportRequest] = React.useState<ImportRequest | null>(null);

  const formMethods = useForm<ExportInventoryIV1CreateDto>({
    defaultValues: {
      exportDate: nkMoment().format('YYYY-MM-DD'),
      departmentId: '',
      importRequestId: '',
      note: '',
    },
  });

  const importRequestId = formMethods.watch('importRequestId');

  React.useEffect(() => {
    if (importRequestId) {
      importRequestApi.v1GetSelect('').then((res) => {
        const importRequest = res.find((item) => item.id === importRequestId);
        if (importRequest) {
          setImportRequest(importRequest);
          if (importRequest.department) formMethods.setValue('departmentId', importRequest.department.id);
        }
      });
    } else {
      formMethods.setValue('departmentId', '');
      setImportRequest(null);
      return;
    }
  }, [importRequestId]);

  const mutate = useMutation(
    (dto: ExportInventoryIV1CreateDto) => {
      return exportInventoryApi.v1Create(dto);
    },
    {
      onSuccess: (data) => {
        const id = _get(data, 'id');
        toast.success('Tạo phiếu xuất kho thành công');
        if (id) {
          router.push(NKRouter.exportInventory.detail(id));
        }
        close();
      },
    },
  );

  return (
    <div>
      <form
        className="flex flex-col gap-4 p-4 bg-white rounded-lg fade-in"
        onSubmit={formMethods.handleSubmit((data) => {
          mutate.mutate(data);
        })}
      >
        <div className="mb-2 text-2xl font-bold">Tạo phiếu xuất kho</div>
        <NKFormWrapper formMethods={formMethods} formActionError={mutate.error}>
          <div className="grid gap-4">
            <NKForm name="exportDate" label="Ngày xuất kho" type={NKFormType.DATE} />
            <NKForm
              name="importRequestId"
              label="Đơn yêu cầu thiết bị"
              type={NKFormType.SELECT_API_OPTION}
              apiAction={async (data) => {
                const res = (await importRequestApi.v1GetSelect(data)).filter((item) => item.status === 'APPROVED' && !item.isDone) as any;

                return addNoSelectOption(res);
              }}
            />

            {importRequest ? (
              <div className="flex flex-col">
                <div>Phòng Ban</div>
                <div className="px-2 py-1 border border-gray-300 border-solid">{importRequest?.department?.name || 'Không có'}</div>
              </div>
            ) : (
              <>
                <NKForm
                  name="departmentId"
                  label="Phòng ban"
                  type={NKFormType.SELECT_API_OPTION}
                  apiAction={async (data: any) => mapListToOptions(await departmentApi.v1GetSelect(data))}
                />
              </>
            )}
            <NKForm name="note" label="Mô tả" type={NKFormType.TEXTAREA} />
          </div>
        </NKFormWrapper>
        <Button type="primary" htmlType="submit" loading={mutate.isLoading}>
          Tạo
        </Button>
      </form>
    </div>
  );
};

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [tabKey, setTabKey] = React.useState('');
  const dataQuery = useQuery(['export-inventory', editId], () => exportInventoryApi.v1GetById(editId as string), {
    enabled: !!editId,
  });

  const statusList = useQuery(
    ['export-inventory-status'],
    () => {
      return exportInventoryApi.v1GetEnumStatus();
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

  return (
    <>
      <Modal open={openEditModal} footer={null} onCancel={() => handleCloseEditModal()}>
        {Boolean(dataQuery.data && editId) && (
          <FormBuilder<ExportInventoryIV1UpdateDto>
            apiAction={(data) => {
              if (!editId) {
                return Promise.reject();
              }

              return exportInventoryApi.v1Update(editId, data);
            }}
            fields={[
              {
                label: 'Ngày xuất kho',
                name: 'exportDate',
                type: NKFormType.DATE,
                span: 3,
              },

              {
                label: 'Phòng ban',
                name: 'departmentId',
                type: NKFormType.SELECT_API_OPTION,
                useAction: async (data) => mapListToOptions(await departmentApi.v1GetSelect(data)),
                span: 3,
              },
              {
                label: 'Mô tả',
                name: 'note',
                type: NKFormType.TEXTAREA,
                span: 3,
              },
            ]}
            defaultValues={{
              departmentId: dataQuery.data?.department?.id || '',
              exportDate: dataQuery.data?.exportDate || nkMoment().format('YYYY-MM-DD'),
              importRequestId: dataQuery.data?.importRequest?.id || '',
              note: dataQuery.data?.note || '',
            }}
            title="Cập nhật phiếu nhập kho"
            onExtraSuccessAction={() => {
              handleCloseEditModal();
              queryClient.invalidateQueries();
            }}
            btnLabel="Cập nhật"
          />
        )}
      </Modal>
      <div>
        <div className="mb-2 text-2xl font-bold">Quản lý xuất kho</div>
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
            sourceKey="exportInventories"
            title=""
            extraFilter={tabKey ? [`status||${FilterComparator.EQUAL}||${tabKey}`] : []}
            queryApi={exportInventoryApi.v1Get}
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
                  {(close) => <CreateForm close={close} />}
                </ModalBuilder>
              </div>
            }
            actionColumns={[
              {
                label: 'Xem chi tiết',
                onClick: (record) => {
                  const id = _get(record, 'id');
                  if (id) {
                    router.push(NKRouter.exportInventory.detail(id));
                  }
                },
              },
              {
                isShow: (record) => {
                  const status = _get(record, 'status');
                  return status === 'REQUESTING';
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
              {
                key: 'contractSymbol',
                title: 'Ký hiệu hoá đơn',
                type: FieldType.TEXT,
              },

              {
                key: 'exportDate',
                title: 'Ngày xuất kho',
                type: FieldType.TIME_DATE,
              },
              {
                title: 'Phòng ban',
                key: 'department.id',
                type: FieldType.BADGE_API,
                apiAction: async () => mapListToOptions(await departmentApi.v1GetSelect('')),
              },
              {
                key: 'status',
                title: 'Trạng thái',
                type: FieldType.BADGE_API,
                apiAction: exportInventoryApi.v1GetEnumStatus,
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
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
