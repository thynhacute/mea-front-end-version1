'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import joi from 'joi';
import _get from 'lodash/get';

import { NKRouter } from '@/core/NKRouter';
import { equipmentApi } from '@/core/api/equipment.api';
import { RepairReportIV1UpdateDto, repairReportApi } from '@/core/api/repair-report.api';
import { RepairRequestIV1UpdateDto, repairRequestApi } from '@/core/api/repair-request.api';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const id = _get(params, 'id') as string;

  const queryData = useQuery(
    ['repair-report', id],
    () => {
      return repairReportApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return (
    <div className="max-w-xl">
      {Boolean(queryData.data) && (
        <FormBuilder<RepairReportIV1UpdateDto>
          apiAction={(dto) => {
            return repairReportApi.v1Update(id, dto);
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
              label: 'Giá',
              name: 'price',
              type: NKFormType.NUMBER,
              span: 3,
            },
            {
              label: 'Trạng thái',
              name: 'status',
              type: NKFormType.SELECT_API_OPTION,
              span: 3,
              useAction: repairReportApi.v1GetEnumStatus,
            },
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
            endAt: queryData.data?.endAt || nkMoment().format('YYYY-MM-DD'),
            note: queryData.data?.note || '',
            startAt: queryData.data?.startAt || nkMoment().format('YYYY-MM-DD'),
            price: queryData.data?.price || 0,
            brokenDate: queryData.data?.brokenDate || null,
          }}
          title="Cập nhật thông tin yêu cầu sửa chữa"
          onExtraSuccessAction={() => {
            router.push(NKRouter.repairRequest.detail(id));
          }}
          btnLabel="Cập nhật"
        />
      )}
    </div>
  );
};

export default Page;
