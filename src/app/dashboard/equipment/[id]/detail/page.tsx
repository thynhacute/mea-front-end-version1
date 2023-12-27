'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { Button, Table, Tabs } from 'antd';
import _get from 'lodash/get';
import { useSelector } from 'react-redux';

import { NKRouter } from '@/core/NKRouter';
import { brandApi } from '@/core/api/brand.api';
import { departmentApi } from '@/core/api/department.api';
import { equipmentCategoryApi } from '@/core/api/equipment-category.api';
import { IV1CreateEquipmentMaintainScheduleDto, equipmentMaintainScheduleApi } from '@/core/api/equipment-maintain-schedule.api';
import { equipmentStatusApi } from '@/core/api/equipment-status.api';
import { ChangeDepartmentDto, EquipmentIV1UpdateStatusDto, equipmentApi } from '@/core/api/equipment.api';
import { repairReportItemApi } from '@/core/api/repair-report-item.api';
import { repairReportApi } from '@/core/api/repair-report.api';
import CTAButton from '@/core/components/cta/CTABtn';
import FieldBadgeApi from '@/core/components/field/FieldBadgeApi';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FieldText from '@/core/components/field/FieldText';
import FieldTime from '@/core/components/field/FieldTime';
import FieldUuid from '@/core/components/field/FieldUuid';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { useBooleanWatcher } from '@/core/hooks/useBooleanWatcher';
import { Equipment } from '@/core/models/equipment';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { mapListToOptions } from '@/core/utils/api.helper';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;
  const { isMaintenanceManager } = useSelector<RootState, UserState>((state) => state.user);

  const queryData = useQuery(
    ['equipment', id],
    () => {
      return equipmentApi.v1GetById(id);
    },
    {},
  );

  const repairReportItems = useQuery(
    ['repairReport', id],
    () => {
      return repairReportApi.v1GetEquipment(id);
    },
    {
      initialData: [],
    },
  );

  const equipmentMaintainSchedules = useQuery(
    ['equipmentMaintainSchedule', id],
    () => {
      return equipmentMaintainScheduleApi.v1GetByEquipmentId(id);
    },
    {
      initialData: [],
    },
  );

  const isDraft = useBooleanWatcher(queryData.data?.currentStatus, 'DRAFT');

  if (queryData.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <FieldBuilder<Equipment>
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
            label: 'Tình trạng thiết bị',
            key: 'currentStatus',
            type: FieldType.BADGE_API,
            apiAction: equipmentStatusApi.v1GetEnumStatus,
            span: 1,
          },
          {
            label: 'Ngày nhập kho',
            key: 'importDate',
            type: FieldType.TIME_FULL,
            span: 1,
          },
          {
            label: 'Ngày hết hạn bảo hành',
            key: 'endOfWarrantyDate',
            type: FieldType.TIME_FULL,
            span: 1,
          },
          {
            label: 'Ngày sản xuất',
            key: 'mfDate',
            type: FieldType.TIME_FULL,
            span: 1,
          },

          {
            label: 'Nhãn hiệu',
            key: 'brand.id',
            type: FieldType.BADGE_API,
            span: 1,
            apiAction: async () => mapListToOptions(await brandApi.v1GetSelect('')),
          },
          {
            label: 'Danh mục thiết bị',
            key: 'equipmentCategory.id',
            type: FieldType.BADGE_API,
            apiAction: async () => mapListToOptions(await equipmentCategoryApi.v1GetSelect('')),
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
            label: 'Phòng ban',
            key: 'department.id',
            type: FieldType.BADGE_API,
            span: 1,
            apiAction: async () => mapListToOptions(await departmentApi.v1GetSelect('')),
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
            {isDraft && (
              <CTAButton
                ctaApi={() => {
                  return equipmentApi.v1Delete(id);
                }}
                isConfirm
                extraOnSuccess={() => router.push(NKRouter.equipment.list())}
              >
                <Button danger>Xoá</Button>
              </CTAButton>
            )}
            {Boolean(queryData.data?.department) && (
              <>
                <ModalBuilder
                  btnLabel="Chuyển phòng ban"
                  modalTitle={`Chuyển phòng ban thiết bị`}
                  btnProps={{
                    type: 'dashed',
                  }}
                >
                  <FormBuilder<ChangeDepartmentDto>
                    apiAction={(dto) => {
                      return equipmentApi.v1ChangeDepartment(id, dto);
                    }}
                    onExtraSuccessAction={() => {
                      queryData.refetch();
                    }}
                    btnLabel="Chuyển phòng ban"
                    fields={[
                      {
                        label: 'Phòng ban',
                        name: 'departmentId',
                        type: NKFormType.SELECT_API_OPTION,
                        span: 3,
                        useAction: async (search) => {
                          const res = await departmentApi.v1GetSelect(search);
                          return mapListToOptions(res.filter((item) => item.id !== queryData.data?.department?.id));
                        },
                      },
                      {
                        label: 'Ghi chú',
                        name: 'note',
                        type: NKFormType.TEXTAREA,
                        span: 3,
                      },
                    ]}
                    title=""
                    defaultValues={{
                      departmentId: '',
                      note: '',
                    }}
                  />
                </ModalBuilder>
              </>
            )}
            <ModalBuilder
              btnLabel="Thay đổi trạng thái"
              modalTitle={`Thay đổi trạng thái thiết bị`}
              btnProps={{
                type: 'primary',
              }}
            >
              <FormBuilder<EquipmentIV1UpdateStatusDto>
                apiAction={(dto) => {
                  return equipmentApi.v1UpdateStatus(id, dto);
                }}
                onExtraSuccessAction={() => {
                  queryData.refetch();
                }}
                btnLabel="Thay đổi trạng thái"
                fields={[
                  {
                    label: 'Ghi chú',
                    name: 'note',
                    type: NKFormType.TEXTAREA,
                    span: 3,
                  },
                  {
                    label: 'Trạng thái',
                    name: 'status',
                    type: NKFormType.SELECT_API_OPTION,
                    span: 3,
                    useAction: equipmentStatusApi.v1GetEnumStatus,
                  },
                ]}
                title=""
                defaultValues={{
                  note: '',
                  status: queryData.data?.currentStatus || '',
                }}
              />
            </ModalBuilder>

            {isMaintenanceManager && (
              <>
                <ModalBuilder
                  btnLabel="Thêm lịch bảo trì"
                  modalTitle={`Thêm lịch bảo trì thiết bị`}
                  btnProps={{
                    type: 'primary',
                  }}
                >
                  <FormBuilder<IV1CreateEquipmentMaintainScheduleDto>
                    apiAction={(dto) => {
                      return equipmentMaintainScheduleApi.v1Create(dto);
                    }}
                    onExtraSuccessAction={() => {
                      queryData.refetch();
                      equipmentMaintainSchedules.refetch();
                    }}
                    btnLabel="Tạo mới"
                    fields={[
                      {
                        label: 'Ghi chú',
                        name: 'note',
                        type: NKFormType.TEXTAREA,
                        span: 3,
                      },
                      {
                        label: 'Ngày bảo trì',
                        name: 'maintenanceDate',
                        type: NKFormType.DATE,
                        span: 3,
                      },
                    ]}
                    title=""
                    defaultValues={{
                      note: '',
                      maintenanceDate: nkMoment().format('YYYY-MM-DD'),
                      equipmentId: id,
                    }}
                  />
                </ModalBuilder>
              </>
            )}
            <Link href={NKRouter.equipment.edit(id)}>
              <Button>Chỉnh sửa</Button>
            </Link>
          </div>
        }
        title="Chi tiết thiết bị"
      />
      <div className="p-4 bg-white rounded-lg">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: 'Trạng thái thiết bị',
              key: 'user',
              children: (
                <>
                  <Table
                    dataSource={queryData.data?.equipmentStatus.sort((a, b) => {
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
                        key: 'note',
                        title: 'Ghi Chú',
                        render: (record) => {
                          const value = _get(record, 'note');
                          return <FieldText value={value} />;
                        },
                      },

                      {
                        key: 'currentStatus',
                        title: 'Trạng thái',
                        render: (record) => {
                          const value = _get(record, 'currentStatus');
                          return <FieldBadgeApi value={value} apiAction={equipmentStatusApi.v1GetEnumStatus} />;
                        },
                      },
                      {
                        key: 'createdAt',
                        title: 'Ngày tạo',
                        render: (record) => {
                          const value = _get(record, 'createdAt');
                          return <FieldDisplay type={FieldType.TIME_FULL} value={value} />;
                        },
                      },
                      {
                        key: 'updatedAt',
                        title: 'Ngày cập nhật',
                        render: (record) => {
                          const value = _get(record, 'updatedAt');
                          return <FieldDisplay type={FieldType.TIME_FULL} value={value} />;
                        },
                      },
                    ]}
                    pagination={false}
                  />
                </>
              ),
            },
            {
              label: 'Lịch sử sửa chữa',
              key: 'repair',
              children: (
                <>
                  <Table
                    dataSource={repairReportItems.data?.sort((a, b) => {
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    })}
                    className="fade-in"
                    rowKey="id"
                    columns={[
                      {
                        key: 'type',
                        title: 'Loại',
                        render: (record) => {
                          const value = _get(record, 'type');
                          return <FieldBadgeApi value={value} apiAction={repairReportItemApi.v1GetEnumType} />;
                        },
                      },
                      {
                        key: 'status',
                        title: 'Trạng thái',
                        render: (record) => {
                          const value = _get(record, 'status');
                          return <FieldBadgeApi value={value} apiAction={repairReportItemApi.v1GetEnumStatusList} />;
                        },
                      },

                      {
                        key: 'createdAt',
                        title: 'Ngày tạo',
                        render: (record) => {
                          const value = _get(record, 'createdAt');
                          console.log(value);
                          return <FieldDisplay type={FieldType.TIME_FULL} value={value} />;
                        },
                      },

                      {
                        key: 'description',
                        title: 'Mô tả',
                        width: 300,
                        render: (record) => {
                          const value = _get(record, 'description');
                          return <FieldDisplay value={value} type={FieldType.MULTILINE_TEXT} />;
                        },
                      },
                      {
                        key: 'startAt',
                        title: 'Ngày bắt đầu',
                        render: (record) => {
                          const value = _get(record, 'repairReport.startAt');
                          return <FieldDisplay type={FieldType.TIME_FULL} value={value} />;
                        },
                      },
                      {
                        key: 'endAt',
                        title: 'Ngày kết thúc',
                        render: (record) => {
                          const value = _get(record, 'repairReport.endAt');
                          return <FieldDisplay type={FieldType.TIME_FULL} value={value} />;
                        },
                      },

                      {
                        key: '',
                        title: '',
                        render: (record) => {
                          const value = _get(record, 'repairReport.id');
                          return (
                            <Link href={NKRouter.repairReport.detail(value)}>
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
              label: 'Kế hoạch bảo trì',
              key: 'maintain',
              children: (
                <>
                  <Table
                    dataSource={equipmentMaintainSchedules.data?.sort((a, b) => {
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    })}
                    className="fade-in"
                    rowKey="id"
                    columns={[
                      {
                        key: 'maintenanceDate',
                        title: 'Ngày bảo trì',
                        render: (record) => {
                          const value = _get(record, 'maintenanceDate');
                          return <FieldDisplay type={FieldType.TIME_FULL} value={value} />;
                        },
                      },
                      {
                        key: 'note',
                        title: 'Ghi chú',
                        render: (record) => {
                          const value = _get(record, 'note');
                          return <FieldDisplay value={value} type={FieldType.MULTILINE_TEXT} />;
                        },
                      },
                      {
                        key: 'isNotified',
                        title: 'Đã thông báo',
                        render: (record) => {
                          const value = _get(record, 'isNotified');
                          return <FieldDisplay type={FieldType.BOOLEAN} value={value} />;
                        },
                      },

                      {
                        key: 'createdAt',
                        title: 'Ngày tạo',
                        render: (record) => {
                          const value = _get(record, 'createdAt');
                          console.log(value);
                          return <FieldDisplay type={FieldType.TIME_FULL} value={value} />;
                        },
                      },
                      {
                        key: '',
                        title: '',
                        render: (record) => {
                          const value = _get(record, 'id');
                          return (
                            <CTAButton
                              ctaApi={() => {
                                return equipmentMaintainScheduleApi.v1Delete(value);
                              }}
                              isConfirm
                              extraOnSuccess={() => {
                                equipmentMaintainSchedules.refetch();
                              }}
                              confirmMessage="Bạn có chắc chắn muốn xoá lịch bảo trì này?"
                            >
                              <Button danger size="small" type="primary">
                                Xoá
                              </Button>
                            </CTAButton>
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
