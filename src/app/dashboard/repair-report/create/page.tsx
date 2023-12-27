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
import { equipmentApi } from '@/core/api/equipment.api';
import { repairReportItemApi } from '@/core/api/repair-report-item.api';
import { RepairReportIV1CreateDto, RepairReportIV1Item, RepairReportV1ReplaceItem, repairReportApi } from '@/core/api/repair-report.api';
import { supplyApi } from '@/core/api/supply.api';
import NKForm, { NKFormType } from '@/core/components/form/NKForm';
import { nkMoment } from '@/core/utils/moment';

const defaultValues: RepairReportIV1CreateDto = {
  description: '',
  repairReportItems: [],
  endAt: nkMoment().format('YYYY-MM-DD'),
  note: '',
  startAt: nkMoment().format('YYYY-MM-DD'),
  price: 0,
  brokenDate: null,
};

const defaultRepairItem: RepairReportIV1Item = {
  description: '',
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

const RepairReplaceItem = ({
  formMethods,
  index,
  subIndex,
}: {
  formMethods: UseFormReturn<any, any, undefined>;
  index: number;
  subIndex: number;
}) => {
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
              const replaceItems = formMethods.getValues(`repairReportItems.${index}.replaceItems`) || [];
              replaceItems.splice(subIndex, 1);
              formMethods.setValue(`repairReportItems.${index}.replaceItems`, replaceItems);
            }}
            icon={<CloseOutlined rev="" />}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <NKForm
          label="Vật tư"
          name={`repairReportItems.${index}.replaceItems.${subIndex}.supplyId`}
          type={NKFormType.SELECT_API_OPTION}
          apiAction={() => {
            return supplyApi.v1GetEquipment(_get(watch, `repairReportItems.${index}.equipmentId`));
          }}
        />
        <NKForm label="Số lượng" name={`repairReportItems.${index}.replaceItems.${subIndex}.quantity`} type={NKFormType.NUMBER} />
      </div>
    </div>
  );
};

const RepairItem = ({ formMethods, index }: { formMethods: UseFormReturn<any, any, undefined>; index: number }) => {
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between">
        <div className="text-lg font-semibold">Chi tiết thiết bị {index + 1}</div>
        <div>
          <Button
            type="primary"
            danger
            onClick={() => {
              const repairReportItems = formMethods.getValues('repairReportItems');
              repairReportItems.splice(index, 1);
              formMethods.setValue('repairReportItems', repairReportItems);
            }}
            icon={<CloseOutlined rev="" />}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <NKForm
          label="Loại"
          name={`repairReportItems.${index}.type`}
          type={NKFormType.SELECT_API_OPTION}
          apiAction={repairReportItemApi.v1GetEnumType}
        />
        <NKForm label="Mô tả" name={`repairReportItems.${index}.description`} type={NKFormType.TEXTAREA} />
        <NKForm
          label="Thiết bị"
          name={`repairReportItems.${index}.equipmentId`}
          type={NKFormType.SELECT_API_OPTION}
          apiAction={equipmentApi.v1Select}
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
                const replaceItems = formMethods.getValues(`repairReportItems.${index}.replaceItems`) || [];
                replaceItems.push(defaultReplaceItem);
                formMethods.setValue(`repairReportItems.${index}.replaceItems`, replaceItems);
              }}
              icon={<PlusOutlined rev="" />}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {formMethods.watch(`repairReportItems.${index}.replaceItems`)?.map((replaceItem: any, replaceItemIndex: number) => (
            <RepairReplaceItem formMethods={formMethods} index={index} subIndex={replaceItemIndex} key={replaceItemIndex} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Page: React.FunctionComponent<PageProps> = () => {
  const formMethods = useForm<RepairReportIV1CreateDto>({
    defaultValues,
  });
  const router = useRouter();

  const repairReportItems = formMethods.watch('repairReportItems') || [];

  const createRepairReportMutation = useMutation((data: RepairReportIV1CreateDto) => repairReportApi.v1Create(data), {
    onSuccess: (data) => {
      toast.success('Tạo phiếu sửa chữa thành công');
      const repairReportId = _get(data, 'id');
      if (repairReportId) {
        router.push(NKRouter.repairReport.detail(repairReportId));
      }
    },
    onError: (error) => {
      toast.error('Tạo phiếu sửa chữa thất bại');
    },
  });

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit((data) => {
          createRepairReportMutation.mutate(data);
        })}
        className="flex flex-col max-w-xl gap-4"
      >
        <div className="flex flex-col gap-2 p-4 bg-white shadow-lg ">
          <div className="mb-2 text-lg font-semibold">Tạo Phiếu Sửa Chữa</div>
          <NKForm label="Ngày bắt đầu" name="startAt" type={NKFormType.DATE} />
          <NKForm label="Ngày kết thúc" name="endAt" type={NKFormType.DATE} />
          <NKForm label="Mô tả" name="description" type={NKFormType.TEXTAREA} />
        </div>

        <div className="p-4 bg-white shadow-xl ">
          <div className="flex justify-between w-full mb-2">
            <div className="text-lg font-semibold">Chi Tiết Phiếu Sửa Chữa</div>
            <div>
              <Button
                type="primary"
                onClick={() => {
                  const repairReportItems = formMethods.getValues('repairReportItems');
                  repairReportItems.push(defaultRepairItem);
                  formMethods.setValue('repairReportItems', repairReportItems);
                }}
                icon={<PlusOutlined rev="" />}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {repairReportItems.map((repairReportItem, index) => (
              <RepairItem formMethods={formMethods} index={index} key={index} />
            ))}
          </div>
        </div>
        <Button type="primary" htmlType="submit">
          Tạo Phiếu Sửa Chữa
        </Button>
      </form>
    </FormProvider>
  );
};

export default Page;
