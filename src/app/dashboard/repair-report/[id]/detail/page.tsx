'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  PlusOutlined,
  SettingOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Table } from 'antd';
import clsx from 'clsx';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';

import { NKRouter } from '@/core/NKRouter';
import { departmentApi } from '@/core/api/department.api';
import { equipmentCategoryApi } from '@/core/api/equipment-category.api';
import { importRequestApi } from '@/core/api/import-request';
import { repairProviderApi } from '@/core/api/repair-provider.api';
import { repairReportItemApi } from '@/core/api/repair-report-item.api';
import {
  RepairReplaceItemIV1CreateDto,
  RepairReplaceItemIV1UpdateDto,
  RepairReportIV1UpdateDto,
  RepairReportItemIV1UpdateDto,
  repairReportApi,
} from '@/core/api/repair-report.api';
import { repairRequestApi } from '@/core/api/repair-request.api';
import { supplyApi } from '@/core/api/supply.api';
import CTAButton from '@/core/components/cta/CTABtn';
import CTAExportXLSXTable from '@/core/components/cta/CTAExportXLSXTable';
import FieldBadgeApi from '@/core/components/field/FieldBadgeApi';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FiledFirstImages from '@/core/components/field/FieldFirstImages';
import FieldNumber from '@/core/components/field/FieldNumber';
import FieldText from '@/core/components/field/FieldText';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import RepairItem from '@/core/components/repairReport/AddRepairReport';
import { useBooleanWatcher } from '@/core/hooks/useBooleanWatcher';
import { ImportPlanItem } from '@/core/models/importPlanItem';
import { ImportRequest } from '@/core/models/importRequest';
import { RepairProvider } from '@/core/models/repairProvider';
import { RepairReport } from '@/core/models/repairReport';
import { RepairReplaceItem, RepairReportItem } from '@/core/models/repairReportItem';
import { RepairRequest } from '@/core/models/repartRequest';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { mapListToOptions } from '@/core/utils/api.helper';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const id = _get(params, 'id') as string;
  const userStoreState = useSelector<RootState, UserState>((state) => state.user);
  const [importRequestId, setImportRequestId] = React.useState<string | undefined>(undefined);
  const [importRequest, setImportRequest] = React.useState<ImportRequest>();
  const [selectedRowGroup, setSelectedRowGroup] = React.useState<RepairReportItem[]>([]);
  const [isAddRepairReport, setIsAddRepairReport] = React.useState<boolean>(false);
  const [errorData, setErrorData] = React.useState<[]>([]);
  const queryData = useQuery(
    ['repair-report', id],
    async () => {
      const res = await repairReportApi.v1GetById(id);
      if (res.importRequestId) {
        setImportRequestId(res.importRequestId);
      }
      return res;
    },
    {
      onSuccess: async (data) => {
        if (data.importRequestId) {
          const res = await importRequestApi.v1GetById(data.importRequestId || '');
          setImportRequest(res);
        }
      },
    },
  );

  const isComplete = useBooleanWatcher(queryData.data?.status, 'COMPLETED');
  const isFixing = useBooleanWatcher(queryData.data?.status, 'FIXING');
  const isWaitingForSupply = useBooleanWatcher(queryData.data?.status, 'WAITING_FOR_SUPPLY');
  const isCancelled = useBooleanWatcher(queryData.data?.status, 'CANCELLED');
  const isRequesting = useBooleanWatcher(queryData.data?.status, 'REQUESTING');
  const isPaused = useBooleanWatcher(queryData.data?.status, 'PAUSED');
  const isSelect = selectedRowGroup.length > 0;
  const router = useRouter();

  if (queryData.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full gap-4">
        <FieldBuilder<RepairReport>
          fields={[
            {
              label: 'Mã',
              key: 'code',
              type: FieldType.TEXT,
              span: 3,
            },
            {
              label: 'Trạng thái',
              key: 'status',
              type: FieldType.BADGE_API,
              apiAction: repairReportApi.v1GetEnumStatus,
              span: 1,
            },
            {
              key: 'startAt',
              label: 'Ngày bắt đầu',
              type: FieldType.TIME_DATE,
              span: 1,
            },
            {
              key: 'endAt',
              label: 'Ngày kết thúc',
              type: FieldType.TIME_DATE,
              span: 1,
            },

            {
              key: 'createdBy.name',
              label: 'Người tạo',
              type: FieldType.TEXT,
              span: 2,
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
              span: 2,
            },

            {
              label: 'Ngày cập nhật',
              key: 'updatedAt',
              type: FieldType.TIME_FULL,
              span: 1,
            },

            ...(queryData.data?.brokenDate !== null
              ? ([
                  {
                    label: 'Ngày báo hỏng',
                    key: 'brokenDate',
                    type: FieldType.TIME_FULL,
                    span: 3,
                  },
                ] as any)
              : []),
            {
              label: 'Ghi chú',
              key: 'note',
              type: FieldType.MULTILINE_TEXT,
              span: 3,
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
              {!queryData.data?.isDeleted && userStoreState.isMaintenanceManager && (
                <>
                  <CTAButton
                    ctaApi={() => {
                      repairReportApi.v1Delete(id);

                      return router;
                    }}
                    extraOnSuccess={() => {
                      router.push(NKRouter.repairReport.list());
                    }}
                    isConfirm
                  >
                    <Button danger type="primary" icon={<DeleteOutlined rev="" />}>
                      Xoá
                    </Button>
                  </CTAButton>
                  {(isRequesting || isWaitingForSupply) && (
                    <>
                      <ModalBuilder
                        btnLabel="Xác nhận"
                        modalTitle={`Xác nhận`}
                        btnProps={{
                          size: 'middle',
                          type: 'primary',
                          icon: <CheckOutlined rev="" />,
                        }}
                      >
                        {(close) => (
                          <FormBuilder<RepairReportIV1UpdateDto>
                            apiAction={async (dto) => {
                              if (queryData.data?.repairReportItems.length === 0) {
                                return Promise.reject({
                                  data: {
                                    message: 'Không có thiết bị nào trong phiếu sửa chữa',
                                  },
                                });
                              }

                              try {
                                setErrorData([]);
                                return await repairReportApi.v1Update(id, {
                                  ...dto,
                                  status: 'FIXING',
                                });
                              } catch (error: any) {
                                try {
                                  console.log(error.data.message);
                                  const errorData = JSON.parse(error.data.message);
                                  setErrorData(errorData);

                                  return Promise.reject({
                                    data: { message: 'Lịch sửa chữa đã tồn tại' },
                                  });
                                } catch (error) {
                                  return error;
                                }
                              }
                            }}
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
                                label: 'Ghi chú',
                                name: 'note',
                                type: NKFormType.TEXTAREA,
                                span: 3,
                              },
                            ]}
                            defaultValues={{
                              description: queryData.data?.description || '',
                              status: queryData.data?.status || '',
                              price: queryData.data?.price || 0,
                              endAt: queryData.data?.endAt || nkMoment().format('YYYY-MM-DD'),
                              note: queryData.data?.note || ``,
                              startAt: queryData.data?.startAt || nkMoment().format('YYYY-MM-DD'),
                              brokenDate: null,
                            }}
                            title=""
                            onExtraSuccessAction={() => {
                              queryData.refetch();
                              close();
                            }}
                            btnLabel="Xác nhận"
                          />
                        )}
                      </ModalBuilder>
                    </>
                  )}
                  {isFixing && (
                    <>
                      <CTAButton
                        ctaApi={async () => {
                          await repairReportApi.v1Update(id, {
                            description: queryData.data?.description || '',
                            price: queryData.data?.price || 0,
                            endAt: queryData.data?.endAt || nkMoment().format('YYYY-MM-DD'),
                            note: queryData.data?.note || '',
                            startAt: queryData.data?.startAt || nkMoment().format('YYYY-MM-DD'),
                            status: 'COMPLETED',
                            brokenDate: queryData.data?.brokenDate || null,
                          });

                          return router;
                        }}
                        extraOnSuccess={() => {
                          queryData.refetch();
                        }}
                        isConfirm
                        confirmMessage="Bạn có chắc chắn muốn hoàn thành phiếu sửa chữa?"
                      >
                        <Button size="middle" type="primary" icon={<CheckOutlined rev="" />}>
                          Hoàn thành
                        </Button>
                      </CTAButton>
                    </>
                  )}
                  {isFixing && (
                    <>
                      <ModalBuilder
                        btnLabel="Tạm dừng"
                        modalTitle={`Tạm dừng`}
                        btnProps={{
                          size: 'middle',

                          icon: <StopOutlined rev="" />,
                        }}
                      >
                        {(close) => (
                          <FormBuilder<RepairReportIV1UpdateDto>
                            apiAction={(dto) => {
                              return repairReportApi.v1Update(id, {
                                ...dto,
                                status: 'PAUSED',
                              });
                            }}
                            fields={[
                              {
                                label: 'Ghi chú',
                                name: 'note',
                                type: NKFormType.TEXTAREA,
                                span: 3,
                              },
                            ]}
                            defaultValues={{
                              description: queryData.data?.description || '',
                              status: queryData.data?.status || '',
                              price: queryData.data?.price || 0,
                              endAt: queryData.data?.endAt || nkMoment().format('YYYY-MM-DD'),
                              note: queryData.data?.note || '',
                              startAt: queryData.data?.startAt || nkMoment().format('YYYY-MM-DD'),
                              brokenDate: queryData.data?.brokenDate || null,
                            }}
                            title=""
                            onExtraSuccessAction={() => {
                              queryData.refetch();
                              close();
                            }}
                            btnLabel="Tạm dừng"
                          />
                        )}
                      </ModalBuilder>
                    </>
                  )}

                  {queryData.data?.createdBy?.role?.index !== 3 && (
                    <>
                      {isPaused && (
                        <>
                          <ModalBuilder
                            btnLabel="Từ chối"
                            modalTitle={`Từ chối`}
                            btnProps={{
                              size: 'middle',
                              danger: true,
                              type: 'primary',
                              icon: <StopOutlined rev="" />,
                            }}
                          >
                            {(close) => (
                              <FormBuilder<RepairReportIV1UpdateDto>
                                apiAction={(dto) => {
                                  return repairReportApi.v1Update(id, {
                                    ...dto,
                                    status: 'CANCELLED',
                                  });
                                }}
                                fields={[
                                  {
                                    label: 'Ghi chú',
                                    name: 'note',
                                    type: NKFormType.TEXTAREA,
                                    span: 3,
                                  },
                                ]}
                                defaultValues={{
                                  description: queryData.data?.description || '',
                                  status: queryData.data?.status || '',
                                  price: queryData.data?.price || 0,
                                  endAt: queryData.data?.endAt || nkMoment().format('YYYY-MM-DD'),
                                  note: queryData.data?.note || '',
                                  startAt: queryData.data?.startAt || nkMoment().format('YYYY-MM-DD'),
                                  brokenDate: queryData.data?.brokenDate || null,
                                }}
                                title=""
                                onExtraSuccessAction={() => {
                                  queryData.refetch();
                                  close();
                                }}
                                btnLabel="Từ chối"
                              />
                            )}
                          </ModalBuilder>
                        </>
                      )}
                    </>
                  )}
                  <ModalBuilder
                    btnLabel="Chỉnh sửa"
                    modalTitle={``}
                    btnProps={{
                      size: 'middle',
                      type: 'default',
                      icon: <EditOutlined rev="" />,
                    }}
                  >
                    {(close) => (
                      <FormBuilder<RepairReportIV1UpdateDto>
                        apiAction={(dto) => {
                          return repairReportApi.v1Update(id, dto);
                        }}
                        fields={[
                          {
                            label: 'Mô tả',
                            name: 'description',
                            type: NKFormType.TEXTAREA,
                            span: 3,
                          },
                          {
                            label: 'Ghi chú',
                            name: 'note',
                            type: NKFormType.TEXTAREA,
                            span: 3,
                          },
                        ]}
                        defaultValues={{
                          description: queryData.data?.description || '',
                          status: queryData.data?.status || '',
                          price: queryData.data?.price || 0,
                          endAt: queryData.data?.endAt || nkMoment().format('YYYY-MM-DD'),
                          note: queryData.data?.note || '',
                          startAt: queryData.data?.startAt || nkMoment().format('YYYY-MM-DD'),
                          brokenDate: queryData.data?.brokenDate || null,
                        }}
                        title="Cập nhật thông tin yêu cầu sửa chữa"
                        onExtraSuccessAction={() => {
                          queryData.refetch();
                          close();
                        }}
                        btnLabel="Cập nhật"
                      />
                    )}
                  </ModalBuilder>
                </>
              )}
            </div>
          }
          title="Chi tiết phiếu sửa chữa"
        />
        {Boolean(importRequest) && (
          <>
            <FieldBuilder<ImportRequest>
              fields={[
                {
                  key: 'name',
                  label: 'Tên Yêu Cầu',
                  type: FieldType.TEXT,
                  span: 2,
                },

                {
                  key: 'status',
                  label: 'Trạng thái',
                  type: FieldType.BADGE_API,
                  apiAction: importRequestApi.v1GetEnumStatus,
                  span: 1,
                },
                {
                  key: 'expected',
                  label: 'Thời gian dự kiến',
                  type: FieldType.BADGE_API,
                  apiAction: importRequestApi.v1GetEnumExpected,
                  span: 2,
                },

                {
                  key: 'isDone',
                  label: 'Đã xuất đủ',
                  type: FieldType.BOOLEAN,
                  span: 1,
                },
              ]}
              record={importRequest}
              extra={<div className="flex items-center gap-4"></div>}
              title="Chi tiết yêu cầu đặt thiết bị"
            />
            <div className="p-6 bg-white rounded-lg">
              <Table
                dataSource={importRequest?.importRequestItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                className="fade-in"
                id="import-plan"
                rowKey="id"
                size="small"
                columns={[
                  {
                    key: 'code',
                    title: 'Mã thiết bị',
                    render: (record: ImportPlanItem) => {
                      const value = _get(record, 'equipment.code') || _get(record, 'supply.code') || '';
                      return <FieldText value={value} />;
                    },
                  },
                  {
                    key: 'name',
                    title: 'Tên thiết bị',
                    render: (record: ImportPlanItem) => {
                      const value = _get(record, 'equipment.name') || _get(record, 'supply.name') || '';
                      return <FieldText value={value} />;
                    },
                  },
                  {
                    key: 'imageUrls',
                    title: 'Ảnh',
                    render: (record: ImportPlanItem) => {
                      const value = _get(record, 'equipment.imageUrls') || _get(record, 'supply.imageUrls') || [];
                      return <FiledFirstImages value={value} />;
                    },
                  },

                  {
                    key: 'category',
                    title: 'Danh mục thiết bị',
                    render: (record: ImportPlanItem) => {
                      const value = _get(record, 'equipment.equipmentCategory.name') || _get(record, 'supply.supplyCategory.name') || '';
                      return <FieldText value={value} />;
                    },
                  },
                  {
                    key: 'brand',
                    title: 'Hãng',
                    render: (record: ImportPlanItem) => {
                      const value = _get(record, 'equipment.brand.name') || _get(record, 'supply.brand.name') || '';
                      return <FieldText value={value} />;
                    },
                  },

                  {
                    key: 'quantity',
                    title: 'Số lượng yêu cầu',
                    render: (record: ImportPlanItem) => {
                      const value = _get(record, 'quantity');
                      return <FieldNumber value={value.toString()} />;
                    },
                  },
                  {
                    key: 'quantity',
                    title: 'Số lượng xuất',
                    render: (record: ImportPlanItem) => {
                      const code = _get(record, 'equipment.code') || _get(record, 'supply.code') || '';
                      const exportItems =
                        importRequest?.exportInventories
                          .filter((item) => item.status === 'APPROVED')
                          .map((item) => item.exportInventoryItems)
                          .flat() || [];
                      let total = 0;
                      for (const item of exportItems) {
                        if (item.supply.code === code) {
                          total += item.quantity;
                        }
                      }

                      return <FieldNumber value={total.toString()} />;
                    },
                  },
                ]}
                pagination={false}
              />
            </div>
          </>
        )}
        <div className="flex flex-col px-2 py-2 bg-white rounded-lg fade-in">
          <div className="flex items-center justify-end gap-4 mb-2">
            {!isSelect && (
              <>
                <CTAExportXLSXTable removeColumns={[]} fileName={`yeu-cau-nhap-kho-${nkMoment().format('YYYY-MM-DD')}`} tableId="import-plan">
                  <Button size="small" icon={<ExportOutlined rev="" />}>
                    Xuất Excel
                  </Button>
                </CTAExportXLSXTable>

                {queryData.data?.createdBy?.role?.index !== 2 && queryData.data?.createdBy?.role?.index !== 1 && (
                  <>
                    {isRequesting && (
                      <Button
                        size="small"
                        type="primary"
                        htmlType="button"
                        icon={<PlusOutlined rev="" />}
                        onClick={() => {
                          setIsAddRepairReport((pre) => !pre);
                          setTimeout(() => {
                            // scroll to bottom
                            window.scrollTo({
                              top: document.body.scrollHeight,
                              behavior: 'smooth',
                            });
                          }, 500);
                        }}
                      >
                        Thêm thiết bị
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <Table
            dataSource={queryData.data?.repairReportItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
            className="fade-in"
            id="import-plan"
            size="small"
            rowKey="id"
            expandable={{
              expandedRowRender: (record) => {
                return (
                  <div className="py-2 bg-gray-300">
                    <Table
                      dataSource={record.repairReplaceItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                      size="small"
                      rowKey="id"
                      className="bg-gray-300"
                      columns={[
                        {
                          key: 'code',
                          title: 'Mã Vật Tư',
                          render: (record: RepairReplaceItem) => {
                            const value = _get(record, 'supply.code') || '';
                            return <FieldText value={value} />;
                          },
                        },
                        {
                          key: 'name',
                          title: 'Tên Vật Tư',
                          render: (record: RepairReplaceItem) => {
                            const value = _get(record, 'supply.name') || '';
                            return <FieldText value={value} />;
                          },
                        },

                        {
                          key: 'quantity',
                          title: 'Số lượng',
                          render: (record: RepairReplaceItem) => {
                            const value = String(_get(record, 'quantity') || '0');
                            return <FieldNumber value={value} />;
                          },
                        },
                        {
                          key: 'id',
                          title: '',
                          width: 50,
                          render: (subRecord: RepairReplaceItem) => {
                            return (
                              <div className="flex gap-2">
                                {!isSelect && isRequesting && (
                                  <>
                                    <CTAButton
                                      extraOnSuccess={() => {
                                        queryData.refetch();
                                      }}
                                      ctaApi={() => {
                                        return repairReportApi.v1DeleteReplaceItem(queryData?.data?.id || '', record.id, subRecord.id);
                                      }}
                                      isConfirm
                                      confirmMessage="Bạn có chắc chắn muốn xoá sản phẩm này?"
                                    >
                                      <Button size="small" type="primary" danger icon={<DeleteOutlined rev="" />}></Button>
                                    </CTAButton>
                                    <ModalBuilder
                                      btnLabel=""
                                      modalTitle=""
                                      btnProps={{
                                        size: 'small',

                                        icon: <EditOutlined rev="" />,
                                      }}
                                    >
                                      {(close) => {
                                        return (
                                          <FormBuilder<RepairReplaceItemIV1UpdateDto>
                                            apiAction={(dto) => {
                                              return repairReportApi.v1UpdateReplaceItem(queryData?.data?.id || '', record.id, subRecord.id, dto);
                                            }}
                                            onExtraSuccessAction={() => {
                                              queryData.refetch();
                                              close();
                                            }}
                                            fields={[
                                              {
                                                label: 'Số lượng',
                                                name: 'quantity',
                                                type: NKFormType.NUMBER,
                                                span: 3,
                                              },
                                            ]}
                                            title="Cập nhật số lượng"
                                            defaultValues={{
                                              quantity: subRecord.quantity || 0,
                                            }}
                                            btnLabel="Cập nhật"
                                          />
                                        );
                                      }}
                                    </ModalBuilder>
                                  </>
                                )}
                              </div>
                            );
                          },
                        },
                      ]}
                      pagination={false}
                    />
                  </div>
                );
              },
              rowExpandable: (record) => record.repairReplaceItems.length > 0,
            }}
            columns={[
              {
                key: 'name',
                title: 'Tên thiết bị',
                render: (record: RepairReportItem) => {
                  // find equipment id in repair report item
                  const error = errorData.find((item: any) => item.id === record.equipment.id) as any;

                  const value = _get(record, 'equipment.name') || '';
                  return (
                    <div
                      className={clsx('', {
                        'text-red-500': error,
                      })}
                    >
                      <FieldText value={value} />
                      {error && (
                        <div className="text-xs">
                          Tồn tại lịch sửa chữa từ ngày {nkMoment(error.startAt).format('DD/MM/YYYY')} đến ngày{' '}
                          {nkMoment(error.endAt).format('DD/MM/YYYY')}
                        </div>
                      )}
                    </div>
                  );
                },
              },
              {
                key: 'code',
                title: 'Mã thiết bị',
                render: (record: RepairReportItem) => {
                  const value = _get(record, 'equipment.code') || '';
                  return <FieldText value={value} />;
                },
              },
              {
                title: 'Phòng Ban',
                key: 'department.id',
                render: (record: RepairReportItem) => {
                  const value = _get(record, 'equipment.department.id') || '';

                  return <FieldBadgeApi value={value} apiAction={async () => mapListToOptions(await departmentApi.v1GetSelect(''))} />;
                },
              },
              {
                key: 'status',
                title: 'Trạng thái',

                render: (record: RepairReportItem) => {
                  const value = _get(record, 'status') || 'WAITING';

                  return (
                    <FieldBadgeApi
                      value={value}
                      apiAction={() => {
                        return repairReportItemApi.v1GetEnumStatusList();
                      }}
                    />
                  );
                },
              },
              {
                key: 'type',
                title: 'Loại Sửa Chữa',
                render: (record: RepairReportItem) => {
                  const value = _get(record, 'type') || '';

                  return <FieldBadgeApi value={value} apiAction={repairReportItemApi.v1GetEnumType} />;
                },
              },
              {
                key: 'feedbackStatus',
                title: 'Phản hồi',
                render: (record: RepairReportItem) => {
                  const value = _get(record, 'feedbackStatus') || '';

                  return <FieldBadgeApi value={value} apiAction={repairReportItemApi.v1GetEnumFeedbackStatus} />;
                },
              },
              {
                key: 'id',
                title: '',
                width: 50,
                render: (record: RepairReportItem) => {
                  if (!userStoreState.isMaintenanceManager) {
                    return <div></div>;
                  }

                  return (
                    <div className="flex gap-2">
                      <ModalBuilder
                        btnLabel=""
                        modalTitle=""
                        btnProps={{
                          size: 'small',
                          type: 'primary',
                          icon: <EyeOutlined rev="" />,
                        }}
                        width="900px"
                      >
                        <FieldBuilder<RepairReportItem>
                          fields={[
                            {
                              label: 'Tên thiết bị',
                              key: 'equipment.name',
                              type: FieldType.TEXT,
                              span: 1,
                            },
                            {
                              label: 'Mã thiết bị',
                              key: 'equipment.code',
                              type: FieldType.TEXT,
                              span: 1,
                            },
                            {
                              label: 'Loại thiết bị',
                              key: 'equipment.equipmentCategory.id',
                              type: FieldType.BADGE_API,
                              apiAction: () => equipmentCategoryApi.v1GetSelect(''),
                              span: 1,
                            },
                            {
                              label: 'Phòng Ban',
                              key: 'department.id',
                              type: FieldType.BADGE_API,
                              apiAction: async () => mapListToOptions(await departmentApi.v1GetSelect('')),
                              span: 1,
                            },
                            {
                              label: 'Trạng thái',
                              key: 'status',
                              type: FieldType.BADGE_API,
                              apiAction: repairReportItemApi.v1GetEnumStatusList,
                              span: 1,
                            },
                            {
                              label: 'Loại',
                              key: 'type',
                              type: FieldType.BADGE_API,
                              apiAction: repairReportItemApi.v1GetEnumType,
                              span: 2,
                            },

                            {
                              label: 'Mô tả',
                              key: 'description',
                              type: FieldType.MULTILINE_TEXT,
                              span: 3,
                            },
                          ]}
                          record={record}
                          title="Chi tiết sửa chữa"
                        />
                        <div className="flex flex-col gap-2">
                          <Table
                            dataSource={record.repairProviders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                            size="small"
                            rowKey="id"
                            className="bg-gray-300"
                            columns={[
                              {
                                key: 'name',
                                title: 'Nhân viên kỹ thuật',
                                render: (record: RepairProvider) => {
                                  const value = _get(record, 'name') || '';
                                  return <FieldText value={value} />;
                                },
                              },
                              {
                                key: 'phone',
                                title: 'Số điện thoại',
                                render: (record: RepairProvider) => {
                                  const value = _get(record, 'phone') || '';
                                  return <FieldText value={value} />;
                                },
                              },
                              {
                                key: 'startWorkDate',
                                title: 'Ngày bắt đầu làm việc',
                                render: (record: RepairProvider) => {
                                  const value = _get(record, 'startWorkDate') || '';
                                  return <FieldDisplay type={FieldType.TIME_DATE} value={value} />;
                                },
                              },
                            ]}
                            pagination={false}
                          />
                        </div>
                      </ModalBuilder>
                      {!isSelect && isRequesting && (
                        <>
                          <ModalBuilder
                            btnLabel=""
                            btnProps={{
                              size: 'small',
                              type: 'primary',
                              icon: <SettingOutlined rev="" />,
                            }}
                            modalTitle=""
                          >
                            {(close) => (
                              <FormBuilder<RepairReplaceItemIV1CreateDto>
                                apiAction={(dto) => {
                                  return repairReportApi.v1CreateReplaceItem(queryData?.data?.id || '', record.id, dto);
                                }}
                                defaultValues={{
                                  quantity: 1,
                                  supplyId: '',
                                }}
                                onExtraSuccessAction={() => {
                                  queryData.refetch();
                                  close();
                                }}
                                fields={[
                                  {
                                    label: 'Vật tư',
                                    name: 'supplyId',
                                    type: NKFormType.SELECT_API_OPTION,
                                    span: 3,
                                    useAction: () => {
                                      return supplyApi.v1GetEquipment(_get(record, 'equipment.id'));
                                    },
                                  },
                                  { label: 'Số lượng', name: 'quantity', type: NKFormType.NUMBER, span: 3 },
                                ]}
                                title="Thêm vật tư thay thế cho thiết bị"
                                btnLabel="Thêm"
                              />
                            )}
                          </ModalBuilder>

                          <CTAButton
                            extraOnSuccess={() => {
                              queryData.refetch();
                            }}
                            ctaApi={() => {
                              return repairReportApi.v1DeleteItem(queryData?.data?.id || '', record.id);
                            }}
                            isConfirm
                            confirmMessage="Bạn có chắc chắn muốn xoá sản phẩm này?"
                          >
                            <Button size="small" type="primary" danger icon={<DeleteOutlined rev="" />}></Button>
                          </CTAButton>
                        </>
                      )}
                      {!isSelect && (isFixing || isRequesting) && (
                        <>
                          <ModalBuilder
                            btnLabel=""
                            modalTitle={`Cập Nhật`}
                            btnProps={{
                              size: 'small',
                              icon: <EditOutlined rev="" />,
                            }}
                          >
                            {(close) => {
                              return (
                                <FormBuilder<RepairReportItemIV1UpdateDto>
                                  apiAction={(dto) => {
                                    return repairReportApi.v1UpdateItem(queryData?.data?.id || '', record.id, dto);
                                  }}
                                  onExtraSuccessAction={() => {
                                    queryData.refetch();
                                    close();
                                  }}
                                  btnLabel="Cập nhật"
                                  fields={[
                                    {
                                      label: 'Nhân viên kỹ thuật',
                                      name: 'repairProviderIds',
                                      type: NKFormType.SELECT_MULTI_API_OPTION,
                                      useAction: repairProviderApi.v1GetSelect,
                                      span: 3,
                                    },

                                    {
                                      label: 'Loại',
                                      name: 'type',
                                      type: NKFormType.SELECT_API_OPTION,
                                      span: 3,
                                      useAction: repairReportItemApi.v1GetEnumType,
                                    },
                                    {
                                      label: 'Trạng thái',
                                      name: 'status',
                                      type: NKFormType.SELECT_API_OPTION,
                                      span: 3,
                                      useAction: repairReportItemApi.v1GetEnumStatusList,
                                    },
                                    {
                                      label: 'Mô tả',
                                      name: 'description',
                                      type: NKFormType.TEXTAREA,
                                      span: 3,
                                    },
                                  ]}
                                  title=""
                                  defaultValues={{
                                    description: record.description || '',
                                    imageUrls: record.imageUrls || [],

                                    type: record.type || '',
                                    status: record.status || '',

                                    repairProviderIds: record.repairProviders.map((item) => item.id),
                                  }}
                                />
                              );
                            }}
                          </ModalBuilder>
                        </>
                      )}
                    </div>
                  );
                },
              },
            ]}
            pagination={false}
          />
        </div>
        {isAddRepairReport && (
          <>
            {queryData.data?.createdBy?.role?.index !== 2 && queryData.data?.createdBy?.role?.index !== 1 && (
              <>
                {isRequesting && (
                  <div className="px-4 py-8 bg-white rounded-lg">
                    <div>
                      <div className="flex mb-2 text-xl font-semibold">Thêm thiết bị</div>

                      <RepairItem
                        id={id}
                        repairList={queryData.data?.repairReportItems || []}
                        onSubmit={() => {
                          queryData.refetch();
                          setIsAddRepairReport(false);
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Page;
