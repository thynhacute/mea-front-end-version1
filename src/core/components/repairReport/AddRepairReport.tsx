'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'antd';
import _get from 'lodash/get';
import { FormProvider, UseFormReturn, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { brandApi } from '@/core/api/brand.api';
import { departmentApi } from '@/core/api/department.api';
import { equipmentCategoryApi } from '@/core/api/equipment-category.api';
import { equipmentStatusApi } from '@/core/api/equipment-status.api';
import { equipmentApi } from '@/core/api/equipment.api';
import { repairProviderApi } from '@/core/api/repair-provider.api';
import { repairReportItemApi } from '@/core/api/repair-report-item.api';
import { RepairReportIV1CreateDto, RepairReportIV1Item, RepairReportV1ReplaceItem, repairReportApi } from '@/core/api/repair-report.api';
import { supplyApi } from '@/core/api/supply.api';
import NKForm, { NKFormType } from '@/core/components/form/NKForm';
import { Department } from '@/core/models/department';
import { Equipment } from '@/core/models/equipment';
import { RepairReportItem } from '@/core/models/repairReportItem';
import { mapListToOptions } from '@/core/utils/api.helper';
import { nkMoment } from '@/core/utils/moment';

import FieldBuilder from '../field/FieldBuilder';
import { FieldType } from '../field/FieldDisplay';

const defaultValues: RepairReportIV1Item = {
  description:
    '- Thay thế linh kiện hỏng hoặc lỗi.\n- Vệ sinh, lau chùi và bôi trơn các bộ phận cần thiết. \n- Kiểm tra và hiệu chỉnh các thông số kỹ thuật theo quy định. \n- Bảo dưỡng định kỳ theo lịch trình sử dụng.\n- Kiểm tra an toàn và hiệu suất sau khi sửa chữa.\n- Lập báo cáo chi tiết về quá trình sửa chữa và thay thế linh kiện',
  equipmentId: '',
  imageUrls: [],
  replaceItems: [],
  repairProviderIds: [],
};

const defaultReplaceItem: RepairReportV1ReplaceItem = {
  quantity: 1,
  supplyId: '',
};

interface PageProps {}

const RepairReplaceItem = ({ formMethods, index }: { formMethods: UseFormReturn<any, any, undefined>; index: number }) => {
  const watch = formMethods.watch();

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between">
        <div className="text-lg font-semibold">Chi tiết vật tư thay thế {index + 1}</div>
        <div>
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => {
              const replaceItems = formMethods.getValues(`replaceItems`) || [];

              replaceItems.splice(index, 1);
              formMethods.setValue(`replaceItems`, replaceItems);
            }}
            icon={<CloseOutlined rev="" />}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <NKForm
          label="Vật tư"
          name={`replaceItems.${index}.supplyId`}
          type={NKFormType.SELECT_API_OPTION}
          apiAction={async () => {
            const res = await supplyApi.v1GetEquipment(_get(watch, `equipmentId`));
            const existingSupplyIds = watch.replaceItems?.map((item: any) => item.supplyId) || [];

            return res.filter((item) => !existingSupplyIds.includes(item.id));
          }}
        />
        <NKForm label="Số lượng" name={`replaceItems.${index}.quantity`} type={NKFormType.NUMBER} />
      </div>
    </div>
  );
};

const RepairItem = ({
  id,
  onSubmit,
  repairList,
}: {
  id: string;

  repairList: RepairReportItem[];
  onSubmit: (data: any) => void;
}) => {
  const formMethods = useForm({
    defaultValues,
  });
  const [equipments, setEquipments] = React.useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = React.useState<Equipment | null>(null);
  const [department, setDepartment] = React.useState<Department | null>(null);
  const equipmentId = formMethods.watch(`equipmentId`);
  const replaceItems = formMethods.watch(`replaceItems`);

  React.useEffect(() => {
    if (equipmentId) {
      formMethods.setValue(`replaceItems`, []);
    }
  }, [equipmentId]);

  React.useEffect(() => {
    if (equipmentId) {
      const equipment = equipments.find((item) => item.id === equipmentId);

      if (equipment) {
        setDepartment(equipment.department);
        setSelectedEquipment(equipment);
      }
    }
  }, [equipmentId, department]);

  const createRepairReportMutation = useMutation((data: RepairReportIV1Item) => repairReportApi.v1CreateItem(id, data), {
    onSuccess: (data) => {
      toast.success(`Cập nhật thành công`);
      onSubmit(data);
    },
    onError: (error) => {
      toast.error('Cập nhật thất bại');
    },
  });

  return (
    <FormProvider {...formMethods}>
      <div className="flex gap-4">
        <form
          className="flex flex-col flex-1 w-full max-w-xl gap-2"
          onSubmit={formMethods.handleSubmit((data) => {
            createRepairReportMutation.mutate(data);
          })}
        >
          <div className="flex flex-col gap-4">
            <NKForm
              label="Thiết bị"
              name={`equipmentId`}
              type={NKFormType.SELECT_API_OPTION}
              apiAction={async (search) => {
                const res = await equipmentApi.v1Select(search);
                setEquipments(res);
                const currentEquipmentIds = repairList.map((item) => item.equipment.id);

                return res
                  .filter((item) => {
                    return item.currentStatus !== 'FIXING' && item.currentStatus !== 'DRAFT' && item.currentStatus !== 'INACTIVE';
                  })
                  .filter((item) => !currentEquipmentIds.includes(item.id));
              }}
            />
            {Boolean(department) && (
              <>
                <div className="flex flex-col w-full gap-1">
                  <label className="text-sm text-black">Phòng Ban</label>
                  <div className="w-full px-2 py-1 border border-gray-200 border-solid">
                    <span>{department?.name}</span>
                  </div>
                </div>
              </>
            )}

            <NKForm label="Loại" name={`type`} type={NKFormType.SELECT_API_OPTION} apiAction={repairReportItemApi.v1GetEnumType} />
            <NKForm label="Mô tả" name={`description`} type={NKFormType.TEXTAREA} />
            <NKForm
              label="Nhân viên kỹ thuật"
              name={`repairProviderIds`}
              type={NKFormType.SELECT_MULTI_API_OPTION}
              apiAction={repairProviderApi.v1GetSelect}
            />
          </div>
          <div className="pl-4">
            <div className="flex items-center justify-between">
              <div className="mb-2 text-lg font-semibold">Chi Tiết Vật Tư Thay Thế</div>
              <div className="flex justify-end">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    const replaceItems = formMethods.getValues(`replaceItems`) || [];
                    replaceItems.push(defaultReplaceItem);
                    formMethods.setValue(`replaceItems`, replaceItems);
                  }}
                  icon={<PlusOutlined rev="" />}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {formMethods.watch(`replaceItems`)?.map((replaceItem: any, index: number) => (
                <RepairReplaceItem formMethods={formMethods} index={index} key={index} />
              ))}
            </div>
          </div>

          <Button type="primary" htmlType="submit">
            Tạo Phiếu Sửa Chữa
          </Button>
        </form>
        {Boolean(selectedEquipment) && (
          <div className="flex-1 transform -translate-y-2">
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
              record={selectedEquipment as Equipment}
              title=""
            />
          </div>
        )}
      </div>
    </FormProvider>
  );
};

export default RepairItem;
