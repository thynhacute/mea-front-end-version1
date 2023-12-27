'use client';

import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import _get from 'lodash/get';
import { Check, FileCog, FileSignature, Hammer } from 'lucide-react';

import { NKRouter } from '@/core/NKRouter';
import { repairReportApi } from '@/core/api/repair-report.api';
import ChartBasicArea from '@/core/components/chart/ChartBasicArea';
import NKChartLabel from '@/core/components/chart/NKChartLabel';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import { FilterComparator, SortOrder } from '@/core/models/common';
import { nkMoment } from '@/core/utils/moment';
import { HKMoment } from '@/core/utils/moment';
import { groupSumValueByMonth, mapToList } from '@/core/utils/report.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  const thisMonthRepairReport = useQuery(
    ['this-month-repair-report'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      const res = await repairReportApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: '',
      });

      return res.length;
    },
    {
      initialData: 0,
    },
  );

  const lastMonthRepairReport = useQuery(
    ['last-month-repair-report'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      start.setMonth(start.getMonth() - 1);

      const end = new Date();
      end.setDate(1);
      end.setHours(0, 0, 0, 0);

      let res = await repairReportApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: '',
      });

      res = res.filter((item) => new Date(item.value.createdAt) < end);

      return res.length;
    },
    {
      initialData: 0,
    },
  );

  const thisMonthRepairReportRequest = useQuery(
    ['this-month-repair-report-request'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      const res = await repairReportApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: '',
      });

      return res.filter((item) => item.value.status === 'REQUESTING').length;
    },
    {
      initialData: 0,
    },
  );

  const lastMonthRepairReportRequest = useQuery(
    ['last-month-repair-report-request'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      start.setMonth(start.getMonth() - 1);

      const end = new Date();
      end.setDate(1);
      end.setHours(0, 0, 0, 0);

      let res = await repairReportApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: '',
      });

      res = res.filter((item) => new Date(item.value.createdAt) < end);

      return res.filter((item) => item.value.status === 'REQUESTING').length;
    },
    {
      initialData: 0,
    },
  );

  const thisMonthRepairReportFixing = useQuery(
    ['this-month-repair-report-fixing'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      const res = await repairReportApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: '',
      });

      return res.filter((item) => item.value.status === 'FIXING').length;
    },
    {
      initialData: 0,
    },
  );

  const lastMonthRepairReportFixing = useQuery(
    ['last-month-repair-report-fixing'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      start.setMonth(start.getMonth() - 1);

      const end = new Date();
      end.setDate(1);
      end.setHours(0, 0, 0, 0);

      let res = await repairReportApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: '',
      });

      res = res.filter((item) => new Date(item.value.createdAt) < end);

      return res.filter((item) => item.value.status === 'FIXING').length;
    },
    {
      initialData: 0,
    },
  );

  const thisMonthRepairReportComplete = useQuery(
    ['this-month-repair-report-complete'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      const res = await repairReportApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: '',
      });

      return res.filter((item) => item.value.status === 'COMPLETED').length;
    },
    {
      initialData: 0,
    },
  );

  const lastMonthRepairReportComplete = useQuery(
    ['last-month-repair-report-complete'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      start.setMonth(start.getMonth() - 1);

      const end = new Date();
      end.setDate(1);
      end.setHours(0, 0, 0, 0);

      let res = await repairReportApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: '',
      });

      res = res.filter((item) => new Date(item.value.createdAt) < end);

      return res.filter((item) => item.value.status === 'COMPLETED').length;
    },
    {
      initialData: 0,
    },
  );

  const repairReport = useQuery(
    ['repair-report'],
    async () => {
      const res = await repairReportApi.v1GetReport({
        filters: [],
        valuePath: '',
      });

      return groupSumValueByMonth(
        res.map((item) => {
          return {
            time: item.value.createdAt,
            value: item.value.repairReportItems.length,
          };
        }),
      );
    },
    {
      initialData: {},
    },
  );

  const top10RepairReport = useQuery(
    ['top-10-repair-report'],
    async () => {
      const res = await repairReportApi.v1Get({
        filters: [`status||${FilterComparator.NOT_EQUAL}||DRAFT`],
        page: 0,
        orderBy: [`createdAt||${SortOrder.DESC}`],
        pageSize: 10,
      });

      return res.data;
    },
    {
      initialData: [],
    },
  );

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-10 fade-in">
      <div className="grid grid-cols-4 col-span-2 gap-8">
        <NKChartLabel
          label="Đơn sửa chữa trong tháng"
          value={thisMonthRepairReport.data}
          lastValue={lastMonthRepairReport.data}
          labelLastValue="tháng trước"
          color="pink"
          prefix={<FileCog />}
        />
        <NKChartLabel
          label="Đơn sửa chữa đang yêu cầu"
          value={thisMonthRepairReportRequest.data}
          lastValue={lastMonthRepairReportRequest.data}
          labelLastValue="tháng trước"
          color="blue"
          prefix={<FileSignature />}
        />
        <NKChartLabel
          label="Đơn sửa chữa đang sửa chữa"
          value={thisMonthRepairReportFixing.data}
          lastValue={lastMonthRepairReportFixing.data}
          labelLastValue="tháng trước"
          color="yellow"
          prefix={<Hammer />}
        />

        <NKChartLabel
          label="Đơn sửa chữa đã hoàn thành"
          value={thisMonthRepairReportComplete.data}
          lastValue={lastMonthRepairReportComplete.data}
          labelLastValue="tháng trước"
          color="green"
          prefix={<Check />}
        />
      </div>
      <div className="p-2 bg-white">
        <ChartBasicArea
          title="Biểu đồ thiết bị sửa chữa"
          unit="Đơn"
          length={1}
          colors={['#3498db']}
          labels={['Đơn sửa chữa']}
          values={mapToList([repairReport.data]).map((item) => ({
            name: nkMoment(item.time).format('MM/YYYY'),
            value: item.value,
          }))}
        />
      </div>

      <div className="flex flex-col gap-2 p-2 bg-white">
        <div className="font-bold text-LG">Đơn sửa chữa mới</div>
        <Table
          size="small"
          columns={[
            {
              title: 'Ngày bắt đầu',
              key: 'name',
              render: (value, record) => {
                return (
                  <FieldDisplay
                    value={{
                      ...record,
                      name: nkMoment(record.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                    }}
                    type={FieldType.ROUTER}
                    apiAction={async (data) => {
                      return NKRouter.repairReport.detail(data) as any;
                    }}
                  />
                );
              },
            },

            {
              title: 'Trạng thái',
              key: 'status',
              render: (value, record) => {
                const status = _get(record, 'status');
                return <FieldDisplay value={status} type={FieldType.BADGE_API} apiAction={repairReportApi.v1GetEnumStatus} />;
              },
            },
          ]}
          dataSource={top10RepairReport.data}
          pagination={false}
          footer={undefined}
        />
      </div>
    </div>
  );
};

export default Page;
