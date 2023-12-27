'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  PaperClipOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Table } from 'antd';
import _get from 'lodash/get';
import { UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKConfig } from '@/core/NKConfig';
import { NKRouter } from '@/core/NKRouter';
import { brandApi } from '@/core/api/brand.api';
import { departmentApi } from '@/core/api/department.api';
import { equipmentCategoryApi } from '@/core/api/equipment-category.api';
import { equipmentApi } from '@/core/api/equipment.api';
import {
  ExportInventoryIV1UpdateDto,
  ExportInventoryItemIV1CreateDto,
  ExportInventoryItemIV1UpdateDto,
  exportInventoryApi,
} from '@/core/api/export-inventory';
import {
  ImportInventoryItemIV1ApproveDto,
  ImportInventoryItemIV1CancelDto,
  ImportInventoryItemIV1CreateDto,
  ImportInventoryItemIV1CreateEquipmentDto,
  ImportInventoryItemIV1UpdateDto,
  importInventoryApi,
} from '@/core/api/import-inventory';
import { ImportPlanItemIV1UpdateDto, importPlanApi } from '@/core/api/import-plan.api';
import { importRequestApi } from '@/core/api/import-request';
import { supplyApi } from '@/core/api/supply.api';
import CTAButton from '@/core/components/cta/CTABtn';
import CTAExportXLSXTable from '@/core/components/cta/CTAExportXLSXTable';
import CTAUploadAction from '@/core/components/cta/CTAUploadAction';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FieldMultipleText from '@/core/components/field/FieldMultipleText';
import FieldNumber from '@/core/components/field/FieldNumber';
import FieldText from '@/core/components/field/FieldText';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { useBooleanWatcher } from '@/core/hooks/useBooleanWatcher';
import { EnumListItem } from '@/core/models/common';
import { Equipment } from '@/core/models/equipment';
import { ExportInventory } from '@/core/models/exportInventory';
import { ExportInventoryItem } from '@/core/models/exportInventoryItem';
import { ImportInventory } from '@/core/models/importInventory';
import { ImportInventoryItem } from '@/core/models/importInventoryItem';
import { ImportRequestItem } from '@/core/models/importRequestItem';
import { Supply } from '@/core/models/supply';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { addNoSelectOption, mapListToOptions } from '@/core/utils/api.helper';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const id = _get(params, 'id') as string;
  const [equipments, setEquipments] = React.useState<Equipment[]>([]);
  const [supplies, setSupplies] = React.useState<Supply[]>([]);
  const [formMethods, setFormMethods] = React.useState<UseFormReturn<any, any, undefined>>();
  const router = useRouter();
  const userStoreState = useSelector<RootState, UserState>((state) => state.user);
  const [importRequestId, setImportRequestId] = React.useState<string>('');

  const [selectedRowGroup, setSelectedRowGroup] = React.useState<ImportRequestItem[]>([]);

  const queryData = useQuery(
    ['export-inventory', id],
    () => {
      return exportInventoryApi.v1GetById(id);
    },
    {
      onSuccess: (data) => {
        const importRequestId = _get(data, 'importRequest.id', '');
        if (importRequestId) {
          setImportRequestId(importRequestId);
        }
      },
    },
  );

  const importRequestQuery = useQuery(
    ['import-request', importRequestId],
    () => {
      return importRequestApi.v1GetById(importRequestId);
    },
    {
      enabled: Boolean(importRequestId),
    },
  );
  const isDraft = useBooleanWatcher(queryData.data?.status, 'DRAFT');
  const isRequesting = useBooleanWatcher(queryData.data?.status, 'REQUESTING');
  const isApproved = useBooleanWatcher(queryData.data?.status, 'APPROVED');
  const isCancelled = useBooleanWatcher(queryData.data?.status, 'CANCELLED');
  const isSelect = selectedRowGroup.length > 0;

  if (queryData.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full gap-4 ">
      <FieldBuilder<ExportInventory>
        fields={[
          {
            key: 'code',
            label: 'Mã',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            key: 'documentNumber',
            label: 'Số chứng từ',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            key: 'contractSymbol',
            label: 'Ký hiệu hoá đơn',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            key: 'startImportDate',
            label: 'Ngày bắt đầu xuất kho',
            type: FieldType.TIME_FULL,
            span: 1,
          },
          {
            key: 'endImportDate',
            label: 'Ngày kết thúc xuất kho',
            type: FieldType.TIME_FULL,
            span: 1,
          },
          {
            key: 'status',
            label: 'Trạng thái',
            type: FieldType.BADGE_API,
            apiAction: exportInventoryApi.v1GetEnumStatus,
            span: 1,
          },
          {
            key: 'department.id',
            label: 'Phòng ban',
            type: FieldType.BADGE_API,

            apiAction: async () => mapListToOptions(await departmentApi.v1GetSelect('')),
            span: 3,
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
            span: 2,
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
            span: 2,
          },
          {
            key: 'note',
            label: 'Mô tả',
            type: FieldType.MULTILINE_TEXT,
            span: 3,
          },
          ...(queryData.data?.importRequest
            ? ([
                {
                  key: 'importRequest',
                  label: 'Đơn yêu cầu thiết bị',
                  type: FieldType.LINK,
                  span: 3,
                  apiAction: async (data: any) => {
                    return {
                      link: NKRouter.importRequest.detail(data.id),
                      label: data.name,
                    };
                  },
                },
              ] as any)
            : []),
        ]}
        record={queryData.data}
        extra={
          <div className="flex items-center gap-4">
            {isRequesting && userStoreState.isInventoryManager && (
              <>
                <ModalBuilder
                  btnLabel="Xác nhận xuất kho"
                  modalTitle=""
                  width="80vw"
                  btnProps={{
                    type: 'primary',
                    icon: <CheckOutlined rev="" />,
                  }}
                >
                  {(close) => (
                    <div>
                      <div className="text-2xl font-bold text-center capitalize">xác nhận xuất kho</div>
                      <div>
                        <FieldBuilder
                          size="small"
                          record={queryData.data}
                          fields={[
                            {
                              key: 'code',
                              label: 'Mã',
                              type: FieldType.TEXT,
                              span: 1,
                            },
                            {
                              key: 'documentNumber',
                              label: 'Số chứng từ',
                              type: FieldType.TEXT,
                              span: 1,
                            },
                            {
                              key: 'contractSymbol',
                              label: 'Ký hiệu hoá đơn',
                              type: FieldType.TEXT,
                              span: 1,
                            },
                            {
                              key: 'startImportDate',
                              label: 'Ngày bắt đầu xuất kho',
                              type: FieldType.TIME_FULL,
                              span: 1,
                            },
                            {
                              key: 'endImportDate',
                              label: 'Ngày kết thúc xuất kho',
                              type: FieldType.TIME_FULL,
                              span: 1,
                            },
                            {
                              key: 'status',
                              label: 'Trạng thái',
                              type: FieldType.BADGE_API,
                              apiAction: exportInventoryApi.v1GetEnumStatus,
                              span: 1,
                            },
                            {
                              key: 'department.id',
                              label: 'Phòng ban',
                              type: FieldType.BADGE_API,

                              apiAction: async () => mapListToOptions(await departmentApi.v1GetSelect('')),
                              span: 3,
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
                              span: 2,
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
                              span: 2,
                            },
                            {
                              key: 'note',
                              label: 'Mô tả',
                              type: FieldType.MULTILINE_TEXT,
                              span: 3,
                            },
                            ...(queryData.data?.importRequest
                              ? ([
                                  {
                                    key: 'importRequest.name',
                                    label: 'Đơn yêu cầu thiết bị',
                                    type: FieldType.TEXT,
                                    span: 3,
                                  },
                                ] as any)
                              : []),
                          ]}
                          title=""
                        />
                      </div>

                      {Boolean(queryData.data?.importRequest) && (
                        <>
                          <Table
                            summary={(pageData) => {
                              const totalQuantity = pageData.map((item) => item.quantity).reduce((acc, item) => acc + item, 0);
                              const totalApprovedQuantity = pageData.map((item) => item.approveQuantity).reduce((acc, item) => acc + item, 0);
                              const remainQuantity = totalQuantity - totalApprovedQuantity;
                              const otherExportedQuantity = importRequestQuery.data?.exportInventories
                                .filter((item) => item.id !== queryData.data?.id || queryData.data?.status === 'APPROVED')
                                .filter((item) => item.status === 'APPROVED')
                                .map((item) => item.exportInventoryItems)
                                .flat()
                                .reduce((acc, item) => acc + item.quantity, 0);
                              let totalExportedQuantity = pageData.map((item) => item.exportQuantity).reduce((acc, item) => acc + item, 0);
                              if (queryData.data?.status === 'APPROVED') {
                                totalExportedQuantity = 0;
                              }

                              return (
                                <>
                                  <Table.Summary.Row className="font-bold">
                                    <Table.Summary.Cell index={0} className="font-bold">
                                      Tổng
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={4}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={5} className="font-bold">
                                      {totalQuantity}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={6} className="font-bold">
                                      {totalApprovedQuantity}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={7} className="font-bold">
                                      {remainQuantity}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={8} className="font-bold">
                                      {otherExportedQuantity}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={9} className="font-bold">
                                      {totalExportedQuantity}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={10}></Table.Summary.Cell>
                                  </Table.Summary.Row>
                                </>
                              );
                            }}
                            dataSource={queryData.data?.importRequest?.importRequestItems
                              ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                              .map((item) => {
                                // FIND EXPORT quantity
                                const exportItem = queryData.data?.exportInventoryItems.find(
                                  (exportItem) => exportItem.supply?.id === item.supply.id,
                                );

                                return {
                                  ...item,
                                  exportQuantity: exportItem?.quantity || 0,
                                  exportInventoryItemId: exportItem?.id,
                                };
                              })}
                            className="fade-in"
                            id="import-plan"
                            rowKey="id"
                            size="small"
                            // rowSelection={
                            //   !isDraft
                            //     ? undefined
                            //     : {
                            //         type: 'checkbox',
                            //         onChange(selectedRowKeys, selectedRows, info) {
                            //           setSelectedRowGroup(selectedRows);
                            //         },
                            //       }
                            // }
                            columns={[
                              {
                                key: 'code',
                                title: 'Mã thiết bị',
                                render: (record: ExportInventoryItem) => {
                                  const value = _get(record, 'supply.code') || _get(record, 'equipment.code') || '';
                                  return <FieldText value={value} />;
                                },
                              },
                              {
                                key: 'name',
                                title: 'Tên hàng',
                                render: (record: ExportInventoryItem) => {
                                  const value = _get(record, 'supply.name') || _get(record, 'equipment.name') || '';
                                  return <FieldText value={value} />;
                                },
                              },

                              {
                                key: 'category',
                                title: 'Loại thiết bị',
                                render: (record: ExportInventoryItem) => {
                                  const value = _get(record, 'equipment.equipmentCategory.name') || _get(record, 'supply.supplyCategory.name') || '';
                                  return <FieldText value={value} />;
                                },
                              },
                              {
                                key: 'brand',
                                title: 'Hãng',
                                render: (record: ExportInventoryItem) => {
                                  const value = _get(record, 'equipment.brand.name') || _get(record, 'supply.brand.name') || '';
                                  return <FieldText value={value} />;
                                },
                              },

                              {
                                key: 'description',
                                title: 'Mô tả',
                                render: (record: ExportInventoryItem) => {
                                  const value = _get(record, 'note');
                                  return <FieldMultipleText value={value} />;
                                },
                              },

                              {
                                key: 'quantity',
                                title: 'SL yêu cầu',
                                render: (record: ExportInventoryItem) => {
                                  const value = _get(record, 'quantity') || 0;

                                  return (
                                    <div className="flex items-center gap-1">
                                      <FieldNumber value={value.toString()} />
                                    </div>
                                  );
                                },
                              },
                              {
                                key: 'quantity',
                                title: 'SL duyệt',
                                render: (record: ExportInventoryItem) => {
                                  const importRequestItem = queryData.data?.importRequest?.importRequestItems.find(
                                    (item) => item.supply.id === record.supply.id,
                                  );

                                  const approvedQuantity = _get(importRequestItem, 'approveQuantity') || 0;
                                  return (
                                    <div className="flex items-center gap-1">
                                      <FieldNumber value={approvedQuantity.toString()} />
                                    </div>
                                  );
                                },
                              },
                              {
                                key: 'quantity',
                                title: 'SL còn lại',
                                render: (record: ExportInventoryItem) => {
                                  const importRequestItem = queryData.data?.importRequest?.importRequestItems.find(
                                    (item) => item.supply.id === record.supply.id,
                                  );

                                  const approvedQuantity = _get(importRequestItem, 'approveQuantity') || 0;
                                  const value = _get(record, 'quantity') || 0;

                                  return (
                                    <div className="flex items-center gap-1">
                                      <FieldNumber value={(value - approvedQuantity).toString()} />
                                    </div>
                                  );
                                },
                              },
                              {
                                key: 'quantity',
                                title: 'SL đã xuất',
                                render: (record: ExportInventoryItem) => {
                                  const exportedQuantity =
                                    importRequestQuery.data?.exportInventories
                                      .filter((item) => item.id !== queryData.data?.id || queryData.data?.status === 'APPROVED')
                                      .filter((item) => item.status === 'APPROVED')
                                      .map((item) => item.exportInventoryItems)
                                      .flat()
                                      .filter((item) => item.supply.id === record.supply.id)
                                      .reduce((acc, item) => acc + item.quantity, 0) || 0;

                                  return <FieldNumber value={exportedQuantity.toString()} />;
                                },
                              },

                              {
                                key: 'quantity',
                                title: 'SL đang xuất',
                                render: (record: ExportInventoryItem) => {
                                  let value = _get(record, 'exportQuantity') || 0;
                                  if (queryData.data?.status === 'APPROVED') {
                                    value = 0;
                                  }
                                  return <FieldNumber value={value.toString()} />;
                                },
                              },
                              {
                                key: 'unit',
                                title: 'Đơn vị tính',
                                render: (record: ExportInventoryItem) => {
                                  const value = _get(record, 'supply.unit') || 'Máy';
                                  return <FieldText value={value} />;
                                },
                              },
                            ]}
                            pagination={false}
                          />
                        </>
                      )}
                      {!Boolean(queryData.data?.importRequest) && (
                        <>
                          <Table
                            summary={(pageData) => {
                              const totalExportedQuantity = pageData.map((item) => item.exportQuantity).reduce((acc, item) => acc + item, 0);

                              return (
                                <>
                                  <Table.Summary.Row className="font-bold">
                                    <Table.Summary.Cell index={0} className="font-bold">
                                      Tổng
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={4}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={5} className="font-bold">
                                      {totalExportedQuantity}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={6}></Table.Summary.Cell>
                                  </Table.Summary.Row>
                                </>
                              );
                            }}
                            dataSource={
                              queryData.data?.importRequest
                                ? [
                                    ...(queryData.data?.importRequest?.importRequestItems
                                      ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                      .map((item) => {
                                        // FIND EXPORT quantity
                                        const exportItem = queryData.data?.exportInventoryItems.find(
                                          (exportItem) => exportItem.supply?.id === item.supply.id,
                                        );

                                        return {
                                          ...item,
                                          exportQuantity: exportItem?.quantity || 0,
                                          exportInventoryItemId: exportItem?.id,
                                        };
                                      }) || []),
                                    ...(queryData.data?.exportInventoryItems
                                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                      .filter((item) => item.equipment)
                                      .map((item) => {
                                        return {
                                          ...item,
                                          exportQuantity: 1,
                                        };
                                      }) || []),
                                  ]
                                : queryData.data?.exportInventoryItems.map((item) => {
                                    return {
                                      ...item,
                                      exportQuantity: item.quantity,

                                      exportInventoryItemId: item.id,
                                    };
                                  }) || []
                            }
                            className="fade-in"
                            id="import-plan"
                            rowKey="id"
                            size="small"
                            // rowSelection={
                            //   !isDraft
                            //     ? undefined
                            //     : {
                            //         type: 'checkbox',
                            //         onChange(selectedRowKeys, selectedRows, info) {
                            //           setSelectedRowGroup(selectedRows);
                            //         },
                            //       }
                            // }
                            columns={[
                              {
                                key: 'code',
                                title: 'Mã thiết bị',
                                render: (record: ExportInventoryItem) => {
                                  const value = _get(record, 'supply.code') || _get(record, 'equipment.code') || '';
                                  return <FieldText value={value} />;
                                },
                              },
                              {
                                key: 'name',
                                title: 'Tên hàng',
                                render: (record: ExportInventoryItem) => {
                                  const value = _get(record, 'supply.name') || _get(record, 'equipment.name') || '';
                                  return <FieldText value={value} />;
                                },
                              },

                              {
                                key: 'category',
                                title: 'Loại thiết bị',
                                render: (record: ExportInventoryItem) => {
                                  const value = _get(record, 'equipment.equipmentCategory.name') || _get(record, 'supply.supplyCategory.name') || '';
                                  return <FieldText value={value} />;
                                },
                              },
                              {
                                key: 'brand',
                                title: 'Hãng',
                                render: (record: ExportInventoryItem) => {
                                  const value = _get(record, 'equipment.brand.name') || _get(record, 'supply.brand.name') || '';
                                  return <FieldText value={value} />;
                                },
                              },

                              {
                                key: 'description',
                                title: 'Mô tả',
                                render: (record: ExportInventoryItem) => {
                                  const value = _get(record, 'note');
                                  return <FieldMultipleText value={value} />;
                                },
                              },
                              ...(queryData.data?.importRequest
                                ? [
                                    {
                                      key: 'quantity',
                                      title: 'SL yêu cầu',
                                      render: (record: ExportInventoryItem) => {
                                        const value = _get(record, 'quantity');
                                        return <FieldNumber value={value.toString()} />;
                                      },
                                    },
                                  ]
                                : []),
                              {
                                key: 'quantity',
                                title: 'SL đang xuất',
                                render: (record: ExportInventoryItem) => {
                                  let value = _get(record, 'exportQuantity') || 0;
                                  if (queryData.data?.status === 'APPROVED') {
                                    value = 0;
                                  }
                                  return <FieldNumber value={value.toString()} />;
                                },
                              },
                              {
                                key: 'unit',
                                title: 'Đơn vị tính',
                                render: (record: ExportInventoryItem) => {
                                  const value = _get(record, 'supply.unit') || 'Máy';
                                  return <FieldText value={value} />;
                                },
                              },
                            ]}
                            pagination={false}
                          />
                        </>
                      )}
                      <div className="flex justify-end mt-4">
                        <CTAButton
                          extraOnSuccess={() => {
                            queryData.refetch();
                            close();
                          }}
                          ctaApi={() => {
                            return exportInventoryApi.v1UpdateApprove(queryData?.data?.id || '', {
                              note: queryData.data?.note || '',
                            });
                          }}
                          isConfirm
                          confirmMessage="Bạn có chắc chắn muốn yêu cầu xuất kho?"
                        >
                          <Button type="primary" icon={<ExportOutlined rev="" />}>
                            Xác nhận xuất kho
                          </Button>
                        </CTAButton>
                      </div>
                    </div>
                  )}
                </ModalBuilder>

                <ModalBuilder
                  modalTitle="Hủy xuất kho"
                  btnLabel="Hủy xuất kho"
                  btnProps={{
                    icon: <CloseOutlined rev="" />,
                    type: 'primary',
                    danger: true,
                  }}
                >
                  <FormBuilder<ImportInventoryItemIV1CancelDto>
                    apiAction={(dto) => {
                      return exportInventoryApi.v1UpdateCancel(queryData?.data?.id || '', dto);
                    }}
                    defaultValues={{
                      note: _get(queryData.data, 'note', '') || '',
                    }}
                    onExtraSuccessAction={() => {
                      queryData.refetch();
                    }}
                    fields={[
                      {
                        label: 'Ghi chú',
                        name: 'note',
                        span: 3,
                        type: NKFormType.TEXTAREA,
                      },
                    ]}
                    title=""
                    btnLabel="Xác nhận"
                  />
                </ModalBuilder>
              </>
            )}

            {isRequesting && (
              <ModalBuilder
                btnLabel="Chỉnh sửa"
                modalTitle={``}
                btnProps={{
                  size: 'middle',
                  type: 'default',
                }}
              >
                {(close) => (
                  <FormBuilder<ExportInventoryIV1UpdateDto>
                    apiAction={(data) => exportInventoryApi.v1Update(id, data)}
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
                      departmentId: queryData.data?.department?.id || '',
                      exportDate: queryData.data?.exportDate || nkMoment().format('YYYY-MM-DD'),
                      importRequestId: queryData.data?.importRequest?.id || '',
                      note: queryData.data?.note || '',
                    }}
                    title="Cập nhật phiếu xuất kho"
                    onExtraSuccessAction={() => {
                      close();
                      queryData.refetch();
                    }}
                    btnLabel="Cập nhật"
                  />
                )}
              </ModalBuilder>
            )}
            {isRequesting && (
              <CTAButton
                extraOnSuccess={() => {
                  router.push(NKRouter.exportInventory.list());
                }}
                ctaApi={() => {
                  return exportInventoryApi.v1Delete(queryData?.data?.id || '');
                }}
                isConfirm
                confirmMessage="Bạn có xoá đơn này?"
              >
                <Button type="primary" danger icon={<CloseOutlined rev="" />}>
                  Xoá phiếu xuất kho
                </Button>
              </CTAButton>
            )}
          </div>
        }
        title="Chi tiết phiếu xuất kho"
      />

      <div className="flex flex-col px-2 py-2 bg-white rounded-lg fade-in">
        <div className="flex items-center justify-end gap-4 mb-2">
          {!isSelect && (
            <>
              <CTAExportXLSXTable fileName={`phieu-xuat-kho-${nkMoment().format('YYYY-MM-DD')}`} tableId="import-plan">
                <Button size="small" icon={<ExportOutlined rev="" />}>
                  Xuất Excel
                </Button>
              </CTAExportXLSXTable>
              {isRequesting && !Boolean(queryData.data?.importRequest) && Boolean(queryData.data?.department) && (
                <ModalBuilder
                  btnLabel="Thêm Vật Tư"
                  modalTitle={`Thêm Vật Tư`}
                  btnProps={{
                    size: 'small',
                    type: 'primary',
                    icon: <PlusOutlined rev="" />,
                  }}
                >
                  {(close) => (
                    <FormBuilder<ExportInventoryItemIV1CreateDto>
                      apiAction={(dto) => {
                        if (queryData.data?.importRequest) {
                          //check if supply is in import request
                          const exportedQuantity =
                            importRequestQuery.data?.exportInventories
                              .filter((item) => item.id !== queryData.data?.id)
                              .filter((item) => item.status === 'APPROVED')
                              .map((item) => item.exportInventoryItems)
                              .flat()
                              .filter((item) => item.supply.id === dto.supplyId)
                              .reduce((acc, item) => acc + item.quantity, 0) || 0;
                          const importRequestQuantity =
                            queryData.data?.importRequest?.importRequestItems.find((item) => item.supply.id === dto.supplyId)?.quantity || 0;

                          const existExportedQuantity =
                            queryData.data?.exportInventoryItems.find((item) => item.supply.id === dto.supplyId)?.quantity || 0;

                          if (exportedQuantity + dto.quantity + existExportedQuantity > importRequestQuantity) {
                            toast.error('Số lượng xuất vượt quá số lượng yêu cầu');
                            return Promise.reject();
                          }
                        }

                        return exportInventoryApi.v1CreateItem(queryData?.data?.id || '', dto);
                      }}
                      onExtraSuccessAction={() => {
                        queryData.refetch();
                        close();
                      }}
                      btnLabel="Thêm"
                      fields={[
                        {
                          label: 'Tên Vật Tư',
                          name: 'supplyId',
                          type: NKFormType.SELECT_API_OPTION,
                          span: 3,
                          useAction: async (value) => {
                            let res = await supplyApi.v1Select(value);
                            if (queryData.data?.importRequest) {
                              const selectAbleSupplies = queryData.data?.importRequest?.importRequestItems.map((item) => item.supply.id) || [];

                              res = res.filter((item) => selectAbleSupplies.includes(item.id));
                            }

                            res = res.map((item) => {
                              return {
                                ...item,
                                name: `${item.name} (${item.quantity} ${item.unit})`,
                              };
                            });
                            return res;
                          },
                        },
                        {
                          label: '',
                          name: 'supplyId',
                          type: NKFormType.WATCH_DISPLAY,
                          isShow: (data) => {
                            return Boolean(data.supplyId);
                          },
                          span: 3,
                          useAction: (value) => {
                            const [supply, setSupply] = React.useState<Supply | null>(null);

                            React.useEffect(() => {
                              supplyApi.v1GetById(value).then((res) => {
                                setSupply(res);
                              });
                            }, [value]);

                            return 'SL trong kho: ' + (supply?.quantity || 0) + ' ' + (supply?.unit || '');
                          },
                        },
                        {
                          label: 'Số lượng',
                          name: 'quantity',
                          type: NKFormType.NUMBER,
                          span: 3,
                        },
                        // {
                        //   label: 'Mô tả',
                        //   name: 'note',
                        //   type: NKFormType.TEXTAREA,
                        //   span: 3,
                        // },
                      ]}
                      title=""
                      defaultValues={{
                        note: '',
                        quantity: 1,
                        supplyId: '',
                        equipmentId: null,
                      }}
                    />
                  )}
                </ModalBuilder>
              )}
              {isRequesting && !Boolean(queryData.data?.importRequest) && Boolean(queryData.data?.department) && (
                <ModalBuilder
                  btnLabel="Thêm Thiết Bị"
                  modalTitle={`Thêm Thiết Bị`}
                  btnProps={{
                    size: 'small',
                    type: 'primary',
                    icon: <PlusOutlined rev="" />,
                  }}
                >
                  {(close) => (
                    <FormBuilder<ExportInventoryItemIV1CreateDto>
                      apiAction={async (dto) => {
                        return exportInventoryApi.v1CreateItem(queryData?.data?.id || '', dto);
                      }}
                      onExtraSuccessAction={() => {
                        close();
                        queryData.refetch();
                      }}
                      btnLabel="Thêm"
                      fields={[
                        {
                          label: 'Tên Thiết Bị',
                          name: 'equipmentId',
                          type: NKFormType.SELECT_API_OPTION,
                          span: 3,
                          useAction: async (value) => {
                            const res = await equipmentApi.v1Select(value);

                            const exportInventoryEquipments = (queryData.data?.exportInventoryItems || [])
                              .filter((item) => item.equipment)
                              .map((item) => item.equipment.id);

                            return res.filter((item) => item.currentStatus === 'IDLE').filter((item) => !exportInventoryEquipments.includes(item.id));
                          },
                        },
                      ]}
                      title=""
                      defaultValues={{
                        equipmentId: '',
                        note: '',
                        quantity: 1,
                        supplyId: null,
                      }}
                    />
                  )}
                </ModalBuilder>
              )}
            </>
          )}

          {isSelect && (
            <>
              <CTAButton
                extraOnSuccess={() => {
                  queryData.refetch();
                }}
                ctaApi={async () => {
                  await Promise.all(
                    selectedRowGroup.map(async (item) => {
                      await exportInventoryApi.v1DeleteItem(queryData?.data?.id || '', item.id);
                    }),
                  );

                  setSelectedRowGroup([]);
                }}
                isConfirm
                confirmMessage="Bạn có chắc chắn muốn xoá các sản phẩm này?"
              >
                <Button size="small" type="primary" danger icon={<DeleteOutlined rev="" />}></Button>
              </CTAButton>
            </>
          )}
        </div>

        {Boolean(queryData.data?.importRequest) && (
          <>
            <Table
              summary={(pageData) => {
                const totalQuantity = pageData.map((item) => item.quantity).reduce((acc, item) => acc + item, 0);
                const totalApprovedQuantity = pageData.map((item) => item.approveQuantity).reduce((acc, item) => acc + item, 0);
                const remainQuantity = totalQuantity - totalApprovedQuantity;
                const otherExportedQuantity = importRequestQuery.data?.exportInventories
                  .filter((item) => item.id !== queryData.data?.id || queryData.data?.status === 'APPROVED')
                  .filter((item) => item.status === 'APPROVED')
                  .map((item) => item.exportInventoryItems)
                  .flat()
                  .reduce((acc, item) => acc + item.quantity, 0);
                let totalExportedQuantity = pageData.map((item) => item.exportQuantity).reduce((acc, item) => acc + item, 0);

                if (queryData.data?.status === 'APPROVED') {
                  totalExportedQuantity = 0;
                }

                return (
                  <>
                    <Table.Summary.Row className="font-bold">
                      <Table.Summary.Cell index={0} className="font-bold">
                        Tổng
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}></Table.Summary.Cell>
                      <Table.Summary.Cell index={4}></Table.Summary.Cell>
                      <Table.Summary.Cell index={5} className="font-bold">
                        {totalQuantity}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6} className="font-bold">
                        {totalApprovedQuantity}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7} className="font-bold">
                        {remainQuantity}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={8} className="font-bold">
                        {otherExportedQuantity}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={9} className="font-bold">
                        {totalExportedQuantity}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={10}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }}
              dataSource={queryData.data?.importRequest?.importRequestItems
                ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((item) => {
                  // FIND EXPORT quantity
                  const exportItem = queryData.data?.exportInventoryItems.find((exportItem) => exportItem.supply?.id === item.supply.id);

                  return {
                    ...item,
                    exportQuantity: exportItem?.quantity || 0,
                    exportInventoryItemId: exportItem?.id,
                  };
                })}
              className="fade-in"
              id="import-plan"
              rowKey="id"
              size="small"
              // rowSelection={
              //   !isDraft
              //     ? undefined
              //     : {
              //         type: 'checkbox',
              //         onChange(selectedRowKeys, selectedRows, info) {
              //           setSelectedRowGroup(selectedRows);
              //         },
              //       }
              // }
              columns={[
                {
                  key: 'code',
                  title: 'Mã thiết bị',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'supply.code') || _get(record, 'equipment.code') || '';
                    return <FieldText value={value} />;
                  },
                },
                {
                  key: 'name',
                  title: 'Tên hàng',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'supply.name') || _get(record, 'equipment.name') || '';
                    return <FieldText value={value} />;
                  },
                },

                {
                  key: 'category',
                  title: 'Loại thiết bị',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'equipment.equipmentCategory.name') || _get(record, 'supply.supplyCategory.name') || '';
                    return <FieldText value={value} />;
                  },
                },
                {
                  key: 'brand',
                  title: 'Hãng',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'equipment.brand.name') || _get(record, 'supply.brand.name') || '';
                    return <FieldText value={value} />;
                  },
                },

                {
                  key: 'description',
                  title: 'Mô tả',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'note');
                    return <FieldMultipleText value={value} />;
                  },
                },

                {
                  key: 'quantity',
                  title: 'SL yêu cầu',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'quantity') || 0;

                    return (
                      <div className="flex items-center gap-1">
                        <FieldNumber value={value.toString()} />
                      </div>
                    );
                  },
                },
                {
                  key: 'quantity',
                  title: 'SL duyệt',
                  render: (record: ExportInventoryItem) => {
                    const importRequestItem = queryData.data?.importRequest?.importRequestItems.find((item) => item.supply.id === record.supply.id);

                    const approvedQuantity = _get(importRequestItem, 'approveQuantity') || 0;
                    return (
                      <div className="flex items-center gap-1">
                        <FieldNumber value={approvedQuantity.toString()} />
                      </div>
                    );
                  },
                },
                {
                  key: 'quantity',
                  title: 'SL còn lại',
                  render: (record: ExportInventoryItem) => {
                    const importRequestItem = queryData.data?.importRequest?.importRequestItems.find((item) => item.supply.id === record.supply.id);

                    const approvedQuantity = _get(importRequestItem, 'approveQuantity') || 0;
                    const value = _get(record, 'quantity') || 0;

                    return (
                      <div className="flex items-center gap-1">
                        <FieldNumber value={(value - approvedQuantity).toString()} />
                      </div>
                    );
                  },
                },
                {
                  key: 'quantity',
                  title: 'SL đã xuất',
                  render: (record: ExportInventoryItem) => {
                    const exportedQuantity =
                      importRequestQuery.data?.exportInventories
                        .filter((item) => item.id !== queryData.data?.id || queryData.data?.status === 'APPROVED')
                        .filter((item) => item.status === 'APPROVED')
                        .map((item) => item.exportInventoryItems)
                        .flat()
                        .filter((item) => item.supply.id === record.supply.id)
                        .reduce((acc, item) => acc + item.quantity, 0) || 0;

                    return <FieldNumber value={exportedQuantity.toString()} />;
                  },
                },

                {
                  key: 'quantity',
                  title: 'SL đang xuất',
                  render: (record: ExportInventoryItem) => {
                    let value = _get(record, 'exportQuantity') || 0;
                    if (queryData.data?.status === 'APPROVED') {
                      value = 0;
                    }
                    return <FieldNumber value={value.toString()} />;
                  },
                },
                {
                  key: 'unit',
                  title: 'Đơn vị tính',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'supply.unit') || 'Máy';
                    return <FieldText value={value} />;
                  },
                },

                {
                  key: 'id',
                  title: '',
                  width: 50,
                  render: (record: ExportInventoryItem) => {
                    const exportQuantity = _get(record, 'exportQuantity', 0);
                    const exportInventoryId = _get(record, 'exportInventoryItemId', '');

                    return (
                      <div className="flex gap-2">
                        {!isSelect && isRequesting && (
                          <>
                            {isRequesting && (
                              <ModalBuilder
                                btnLabel=""
                                modalTitle={`Thêm Vật Tư`}
                                btnProps={{
                                  size: 'small',
                                  type: 'primary',
                                  icon: <PlusOutlined rev="" />,
                                }}
                              >
                                {(close) => (
                                  <FormBuilder<ExportInventoryItemIV1CreateDto>
                                    apiAction={(dto) => {
                                      if (queryData.data?.importRequest) {
                                        //check if supply is in import request
                                        const exportedQuantity =
                                          importRequestQuery.data?.exportInventories
                                            .filter((item) => item.id !== queryData.data?.id)
                                            .filter((item) => item.status === 'APPROVED')
                                            .map((item) => item.exportInventoryItems)
                                            .flat()
                                            .filter((item) => item.supply.id === dto.supplyId)
                                            .reduce((acc, item) => acc + item.quantity, 0) || 0;
                                        const importRequestQuantity =
                                          queryData.data?.importRequest?.importRequestItems.find((item) => item.supply.id === dto.supplyId)
                                            ?.quantity || 0;

                                        const existExportedQuantity =
                                          queryData.data?.exportInventoryItems.find((item) => item.supply.id === dto.supplyId)?.quantity || 0;

                                        if (exportedQuantity + dto.quantity + existExportedQuantity > importRequestQuantity) {
                                          toast.error('Số lượng xuất vượt quá số lượng yêu cầu');
                                          return Promise.reject();
                                        }
                                      }

                                      return exportInventoryApi.v1CreateItem(queryData?.data?.id || '', dto);
                                    }}
                                    onExtraSuccessAction={() => {
                                      queryData.refetch();
                                      close();
                                    }}
                                    btnLabel="Thêm"
                                    fields={[
                                      {
                                        label: 'Tên Vật Tư',
                                        name: 'supplyId',
                                        type: NKFormType.SELECT_API_OPTION,
                                        span: 3,
                                        fieldProps: {
                                          disabled: true,
                                        },
                                        useAction: async (value) => {
                                          let res = await supplyApi.v1Select(value);
                                          if (queryData.data?.importRequest) {
                                            const selectAbleSupplies =
                                              queryData.data?.importRequest?.importRequestItems.map((item) => item.supply.id) || [];

                                            res = res.filter((item) => selectAbleSupplies.includes(item.id));
                                          }

                                          res = res.map((item) => {
                                            return {
                                              ...item,
                                              name: `${item.name} (${item.quantity} ${item.unit})`,
                                            };
                                          });
                                          return res;
                                        },
                                      },
                                      {
                                        label: 'Số lượng',
                                        name: 'quantity',
                                        type: NKFormType.NUMBER,
                                        span: 3,
                                      },
                                      {
                                        label: 'Mô tả',
                                        name: 'note',
                                        type: NKFormType.TEXTAREA,
                                        span: 3,
                                      },
                                    ]}
                                    title=""
                                    defaultValues={{
                                      note: '',
                                      quantity: 1,
                                      supplyId: record.supply.id,
                                      equipmentId: null,
                                    }}
                                  />
                                )}
                              </ModalBuilder>
                            )}
                            {Boolean(exportInventoryId) && (
                              <CTAButton
                                extraOnSuccess={async () => {
                                  queryData.refetch();
                                }}
                                ctaApi={() => {
                                  return exportInventoryApi.v1DeleteItem(queryData?.data?.id || '', exportInventoryId);
                                }}
                                isConfirm
                                confirmMessage="Bạn có chắc chắn muốn xoá sản phẩm này?"
                              >
                                <Button size="small" type="primary" danger icon={<DeleteOutlined rev="" />}></Button>
                              </CTAButton>
                            )}

                            {exportInventoryId && (
                              <ModalBuilder
                                btnLabel=""
                                modalTitle={`Chỉnh sửa hàng hóa`}
                                btnProps={{
                                  size: 'small',
                                  icon: <EditOutlined rev="" />,
                                }}
                              >
                                {(close) => (
                                  <FormBuilder<ExportInventoryItemIV1UpdateDto>
                                    apiAction={(dto) => {
                                      if (queryData.data?.importRequest) {
                                        //check if supply is in import request
                                        const exportedQuantity =
                                          importRequestQuery.data?.exportInventories
                                            .filter((item) => item.id !== queryData.data?.id)
                                            .filter((item) => item.status === 'APPROVED')
                                            .map((item) => item.exportInventoryItems)
                                            .flat()
                                            .filter((item) => item.supply.id === record.supply.id)
                                            .reduce((acc, item) => acc + item.quantity, 0) || 0;

                                        const importRequestQuantity =
                                          importRequestQuery.data?.importRequestItems.find((item) => item.supply.id === record.supply.id)?.quantity ||
                                          0;

                                        if (exportedQuantity + dto.quantity > importRequestQuantity) {
                                          toast.error('Số lượng xuất vượt quá số lượng yêu cầu');
                                          return Promise.reject();
                                        }
                                      }

                                      return exportInventoryApi.v1UpdateItem(queryData?.data?.id || '', exportInventoryId, dto);
                                    }}
                                    btnLabel="Cập nhật"
                                    onExtraSuccessAction={() => {
                                      queryData.refetch();
                                      close();
                                    }}
                                    setFormMethods={(data) => setFormMethods(data)}
                                    fields={[
                                      ...(record.equipment
                                        ? []
                                        : ([
                                            {
                                              label: 'Số lượng',
                                              name: 'quantity',
                                              type: NKFormType.NUMBER,
                                              span: 3,
                                            },
                                          ] as any)),

                                      {
                                        label: 'Mô tả',
                                        name: 'note',
                                        type: NKFormType.TEXTAREA,
                                        span: 3,
                                      },
                                    ]}
                                    title=""
                                    defaultValues={{
                                      quantity: exportQuantity || 0,
                                      note: record.note || '',
                                    }}
                                  />
                                )}
                              </ModalBuilder>
                            )}
                          </>
                        )}
                      </div>
                    );
                  },
                },
              ]}
              pagination={false}
            />
          </>
        )}
        {!Boolean(queryData.data?.importRequest) && (
          <>
            <Table
              summary={(pageData) => {
                const totalExportedQuantity = pageData.map((item) => item.exportQuantity).reduce((acc, item) => acc + item, 0);

                return (
                  <>
                    <Table.Summary.Row className="font-bold">
                      <Table.Summary.Cell index={0} className="font-bold">
                        Tổng
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}></Table.Summary.Cell>
                      <Table.Summary.Cell index={4}></Table.Summary.Cell>
                      <Table.Summary.Cell index={4}></Table.Summary.Cell>
                      <Table.Summary.Cell index={5} className="font-bold">
                        {totalExportedQuantity}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }}
              dataSource={
                queryData.data?.importRequest
                  ? [
                      ...(queryData.data?.importRequest?.importRequestItems
                        ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((item) => {
                          // FIND EXPORT quantity
                          const exportItem = queryData.data?.exportInventoryItems.find((exportItem) => exportItem.supply?.id === item.supply.id);

                          return {
                            ...item,
                            exportQuantity: exportItem?.quantity || 0,
                            exportInventoryItemId: exportItem?.id,
                          };
                        }) || []),
                      ...(queryData.data?.exportInventoryItems
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .filter((item) => item.equipment)
                        .map((item) => {
                          return {
                            ...item,
                            exportQuantity: 1,
                          };
                        }) || []),
                    ]
                  : queryData.data?.exportInventoryItems.map((item) => {
                      return {
                        ...item,
                        exportQuantity: item.quantity,

                        exportInventoryItemId: item.id,
                      };
                    }) || []
              }
              className="fade-in"
              id="import-plan"
              rowKey="id"
              size="small"
              // rowSelection={
              //   !isDraft
              //     ? undefined
              //     : {
              //         type: 'checkbox',
              //         onChange(selectedRowKeys, selectedRows, info) {
              //           setSelectedRowGroup(selectedRows);
              //         },
              //       }
              // }
              columns={[
                {
                  key: 'code',
                  title: 'Mã thiết bị',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'supply.code') || _get(record, 'equipment.code') || '';
                    return <FieldText value={value} />;
                  },
                },
                {
                  key: 'name',
                  title: 'Tên hàng',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'supply.name') || _get(record, 'equipment.name') || '';
                    return <FieldText value={value} />;
                  },
                },

                {
                  key: 'category',
                  title: 'Loại thiết bị',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'equipment.equipmentCategory.name') || _get(record, 'supply.supplyCategory.name') || '';
                    return <FieldText value={value} />;
                  },
                },
                {
                  key: 'brand',
                  title: 'Hãng',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'equipment.brand.name') || _get(record, 'supply.brand.name') || '';
                    return <FieldText value={value} />;
                  },
                },

                {
                  key: 'description',
                  title: 'Mô tả',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'note');
                    return <FieldMultipleText value={value} />;
                  },
                },
                ...(queryData.data?.importRequest
                  ? [
                      {
                        key: 'quantity',
                        title: 'SL yêu cầu',
                        render: (record: ExportInventoryItem) => {
                          const value = _get(record, 'quantity');
                          return <FieldNumber value={value.toString()} />;
                        },
                      },
                    ]
                  : []),
                {
                  key: 'quantity',
                  title: 'SL trong kho',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'supply.quantity') || 1;
                    return <FieldNumber value={value.toString()} />;
                  },
                },
                {
                  key: 'quantity',
                  title: 'SL đang xuất',
                  render: (record: ExportInventoryItem) => {
                    let value = _get(record, 'exportQuantity') || 0;
                    if (queryData.data?.status === 'APPROVED') {
                      value = 0;
                    }
                    return <FieldNumber value={value.toString()} />;
                  },
                },
                {
                  key: 'unit',
                  title: 'Đơn vị tính',
                  render: (record: ExportInventoryItem) => {
                    const value = _get(record, 'supply.unit') || 'Máy';
                    return <FieldText value={value} />;
                  },
                },

                {
                  key: 'id',
                  title: '',
                  width: 50,
                  render: (record: ExportInventoryItem) => {
                    const exportQuantity = _get(record, 'exportQuantity', 0);
                    const exportInventoryId = _get(record, 'exportInventoryItemId', '');

                    return (
                      <div className="flex gap-2">
                        {!isSelect && isRequesting && (
                          <>
                            {!queryData.data?.importRequest && (
                              <CTAButton
                                extraOnSuccess={async () => {
                                  queryData.refetch();
                                }}
                                ctaApi={() => {
                                  return exportInventoryApi.v1DeleteItem(queryData?.data?.id || '', record.id);
                                }}
                                isConfirm
                                confirmMessage="Bạn có chắc chắn muốn xoá sản phẩm này?"
                              >
                                <Button size="small" type="primary" danger icon={<DeleteOutlined rev="" />}></Button>
                              </CTAButton>
                            )}

                            {exportInventoryId && (
                              <ModalBuilder
                                btnLabel=""
                                modalTitle={`Chỉnh sửa hàng hóa`}
                                btnProps={{
                                  size: 'small',
                                  icon: <EditOutlined rev="" />,
                                }}
                              >
                                {(close) => (
                                  <FormBuilder<ExportInventoryItemIV1UpdateDto>
                                    apiAction={(dto) => {
                                      return exportInventoryApi.v1UpdateItem(queryData?.data?.id || '', exportInventoryId, dto);
                                    }}
                                    btnLabel="Cập nhật"
                                    onExtraSuccessAction={() => {
                                      queryData.refetch();
                                      close();
                                    }}
                                    setFormMethods={(data) => setFormMethods(data)}
                                    fields={[
                                      ...(record.equipment
                                        ? []
                                        : ([
                                            {
                                              label: 'Số lượng',
                                              name: 'quantity',
                                              type: NKFormType.NUMBER,
                                              span: 3,
                                            },
                                          ] as any)),

                                      {
                                        label: 'Mô tả',
                                        name: 'note',
                                        type: NKFormType.TEXTAREA,
                                        span: 3,
                                      },
                                    ]}
                                    title=""
                                    defaultValues={{
                                      quantity: exportQuantity || 0,
                                      note: record.note || '',
                                    }}
                                  />
                                )}
                              </ModalBuilder>
                            )}
                          </>
                        )}
                      </div>
                    );
                  },
                },
              ]}
              pagination={false}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
