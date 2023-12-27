'use client';

import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import _get from 'lodash/get';
import { ClipboardCopy, PackageMinus, PackagePlus, Truck } from 'lucide-react';

import { NKRouter } from '@/core/NKRouter';
import { exportInventoryApi } from '@/core/api/export-inventory';
import { importInventoryApi } from '@/core/api/import-inventory';
import { importPlanApi } from '@/core/api/import-plan.api';
import { importRequestApi } from '@/core/api/import-request';
import { repairReportApi } from '@/core/api/repair-report.api';
import ChartBasicArea from '@/core/components/chart/ChartBasicArea';
import NKChartLabel from '@/core/components/chart/NKChartLabel';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import { FilterComparator, SortOrder } from '@/core/models/common';
import { ExportInventoryItem } from '@/core/models/exportInventoryItem';
import { ImportInventoryItem } from '@/core/models/importInventoryItem';
import { nkMoment } from '@/core/utils/moment';
import { HKMoment } from '@/core/utils/moment';
import { groupSumValueByMonth, mapToList } from '@/core/utils/report.helper';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const [isMounted, setIsMounted] = React.useState(false);
  const thisMonthImportInventory = useQuery(
    ['this-month-import-inventory'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      const res = await importInventoryApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: '',
      });

      return res.reduce((acc: number, cur: any) => {
        return (
          acc +
          cur.value.importInventoryItems.reduce((acc: number, cur: ImportInventoryItem) => {
            return acc + cur.quantity;
          }, 0)
        );
      }, 0);
    },
    {
      initialData: 0,
    },
  );

  const lastMonthImportInventory = useQuery(
    ['last-month-import-inventory'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      start.setMonth(start.getMonth() - 1);

      const end = new Date();
      end.setDate(1);
      end.setHours(0, 0, 0, 0);

      let res = await importInventoryApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: '',
      });

      res = res.filter((item) => new Date(item.value.createdAt) < end);

      return res.reduce((acc: number, cur: any) => {
        return (
          acc +
          cur.value.importInventoryItems.reduce((acc: number, cur: ImportInventoryItem) => {
            return acc + cur.quantity;
          }, 0)
        );
      }, 0);
    },
    {
      initialData: 0,
    },
  );

  const thisMonthExportInventory = useQuery(
    ['this-month-export-inventory'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      const res = await exportInventoryApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: '',
      });

      return res.reduce((acc: number, cur: any) => {
        return (
          acc +
          cur.value.exportInventoryItems.reduce((acc: number, cur: ExportInventoryItem) => {
            return acc + cur.quantity;
          }, 0)
        );
      }, 0);
    },
    {
      initialData: 0,
    },
  );

  const lastMonthExportInventory = useQuery(
    ['last-month-export-inventory'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      start.setMonth(start.getMonth() - 1);

      const end = new Date();
      end.setDate(1);
      end.setHours(0, 0, 0, 0);

      let res = await exportInventoryApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: '',
      });
      res = res.filter((item) => new Date(item.value.createdAt) < end);

      return res.reduce((acc: number, cur: any) => {
        return (
          acc +
          cur.value.exportInventoryItems.reduce((acc: number, cur: ExportInventoryItem) => {
            return acc + cur.quantity;
          }, 0)
        );
      }, 0);
    },
    {
      initialData: 0,
    },
  );

  const thisMonthImportPlan = useQuery(
    ['this-month-import-plan'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      const res = await importPlanApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: 'createdAt',
      });

      return res.length;
    },
    {
      initialData: 0,
    },
  );

  const lastMonthImportPlan = useQuery(
    ['last-month-import-plan'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      start.setMonth(start.getMonth() - 1);

      const end = new Date();
      end.setDate(1);
      end.setHours(0, 0, 0, 0);

      let res = await importPlanApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: 'createdAt',
      });
      res = res.filter((item) => new Date(item.value.createdAt) < end);

      return res.length;
    },
    {
      initialData: 0,
    },
  );

  const thisMonthImportRequest = useQuery(
    ['this-month-import-request'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      const res = await importRequestApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: 'createdAt',
      });

      return res.length;
    },
    {
      initialData: 0,
    },
  );

  const lastMonthImportRequest = useQuery(
    ['last-month-import-request'],
    async () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      start.setMonth(start.getMonth() - 1);

      const end = new Date();
      end.setDate(1);
      end.setHours(0, 0, 0, 0);

      let res = await importRequestApi.v1GetReport({
        filters: [`createdAt||${FilterComparator.GREATER_THAN_OR_EQUAL}||${HKMoment.formatFilter(start)}`],
        valuePath: 'createdAt',
      });
      res = res.filter((item) => new Date(item.value.createdAt) < end);

      return res.length;
    },
    {
      initialData: 0,
    },
  );

  const importInventory = useQuery(
    ['import-inventory'],
    async () => {
      const res = await importInventoryApi.v1GetReport({
        filters: [],
        valuePath: '',
      });

      return groupSumValueByMonth(
        res.map((item) => {
          const total = item.value.importInventoryItems.reduce((acc: number, cur: ImportInventoryItem) => {
            return acc + cur.quantity;
          }, 0);

          return {
            time: item.value.createdAt,
            value: total,
          };
        }),
      );
    },
    {
      initialData: {},
    },
  );

  const exportInventory = useQuery(
    ['export-inventory'],
    async () => {
      const res = await exportInventoryApi.v1GetReport({
        filters: [],
        valuePath: '',
      });

      return groupSumValueByMonth(
        res.map((item) => {
          const total = item.value.exportInventoryItems.reduce((acc: number, cur: ExportInventoryItem) => {
            return acc + cur.quantity;
          }, 0);

          return {
            time: item.value.createdAt,
            value: total,
          };
        }),
      );
    },
    {
      initialData: {},
    },
  );

  const top10NewImportInventory = useQuery(
    ['top-10-new-import-inventory'],
    async () => {
      const res = await importInventoryApi.v1Get({
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

  const top10NewExportInventory = useQuery(
    ['top-10-new-export-inventory'],
    async () => {
      const res = await exportInventoryApi.v1Get({
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
          label="Nhập kho trong tháng"
          value={thisMonthImportInventory.data}
          lastValue={lastMonthImportInventory.data}
          labelLastValue="tháng trước"
          color="blue"
          prefix={<PackagePlus />}
        />
        <NKChartLabel
          label="Xuất kho trong tháng"
          value={thisMonthExportInventory.data}
          lastValue={lastMonthExportInventory.data}
          labelLastValue="tháng trước"
          color="orange"
          prefix={<PackageMinus />}
        />
        <NKChartLabel
          label="Kế hoạch mua sắm trong tháng"
          value={thisMonthImportPlan.data}
          lastValue={lastMonthImportPlan.data}
          labelLastValue="tháng trước"
          color="green"
          prefix={<ClipboardCopy />}
        />

        <NKChartLabel
          label="Yêu cầu đặt thiết bị trong tháng"
          value={thisMonthImportRequest.data}
          lastValue={lastMonthImportRequest.data}
          labelLastValue="tháng trước"
          color="red"
          prefix={<Truck />}
        />
      </div>
      <div className="p-2 bg-white">
        <ChartBasicArea
          title="Biểu đồ nhập xuất kho"
          unit="Sản Phẩm"
          length={2}
          colors={['#3498db', '#e74c3c']}
          labels={['Nhập kho', 'Xuất kho']}
          values={mapToList([importInventory.data, exportInventory.data]).map((item) => ({
            name: nkMoment(item.time).format('MM/YYYY'),
            value: item.value,
          }))}
        />
      </div>
      <div className="flex flex-col gap-2 p-2 bg-white">
        <div className="font-bold text-LG">Đơn nhập kho mới</div>
        <Table
          size="small"
          columns={[
            {
              title: 'Tên',
              key: 'name',
              render: (value, record) => {
                return (
                  <FieldDisplay
                    value={record}
                    type={FieldType.ROUTER}
                    apiAction={async (data) => {
                      return NKRouter.importInventory.detail(data) as any;
                    }}
                  />
                );
              },
            },
            {
              title: 'Mã',
              key: 'code',
              render: (value, record) => {
                const code = _get(record, 'code');
                return <FieldDisplay value={code} type={FieldType.TEXT} />;
              },
            },
            {
              title: 'Trạng thái',
              key: 'status',
              render: (value, record) => {
                const status = _get(record, 'status');
                return <FieldDisplay value={status} type={FieldType.BADGE_API} apiAction={importInventoryApi.v1GetEnumStatus} />;
              },
            },
          ]}
          dataSource={top10NewImportInventory.data}
          pagination={false}
          footer={undefined}
        />
      </div>
      <div className="flex flex-col gap-2 p-2 bg-white">
        <div className="font-bold text-LG">Đơn xuất kho mới</div>
        <Table
          size="small"
          columns={[
            {
              title: 'Code',
              key: 'name',
              render: (value, record) => {
                return (
                  <FieldDisplay
                    value={{
                      ...record,
                      name: record.code,
                    }}
                    type={FieldType.ROUTER}
                    apiAction={async (data) => {
                      return NKRouter.exportInventory.detail(data) as any;
                    }}
                  />
                );
              },
            },
            {
              title: 'Ký hiệu hoá đơn',
              key: 'code',
              render: (value, record) => {
                const code = _get(record, 'contractSymbol');
                return <FieldDisplay value={code} type={FieldType.TEXT} />;
              },
            },
            {
              title: 'Trạng thái',
              key: 'status',
              render: (value, record) => {
                const status = _get(record, 'status');
                return <FieldDisplay value={status} type={FieldType.BADGE_API} apiAction={exportInventoryApi.v1GetEnumStatus} />;
              },
            },
          ]}
          dataSource={top10NewExportInventory.data}
          pagination={false}
          footer={undefined}
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
