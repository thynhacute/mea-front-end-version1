import * as React from 'react';

import dynamic from 'next/dynamic';

import { formatNumber } from '@/core/utils/number.helper';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartBasicLineProps {
  values: {
    name: string;
    data: number;
  }[];
  unit: string;
  title: string;
}

const ChartBasicLine: React.FC<ChartBasicLineProps> = ({ title, values, unit }) => {
  return (
    <div>
      <ReactApexChart
        options={{
          tooltip: {
            y: {
              formatter: (value: any) => {
                return formatNumber(value);
              },
            },
          },
          chart: {
            height: 350,
            type: 'line',
            zoom: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'straight',
          },
          title: {
            text: title,
            align: 'left',
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5,
            },
          },
          yaxis: {
            labels: {
              formatter: (value: any) => {
                return formatNumber(value);
              },
            },
          },
          xaxis: {
            categories: values.map((item) => item.name),
          },
        }}
        series={[
          {
            name: unit,
            data: values.map((item) => item.data),
          },
        ]}
        type="line"
        height={350}
      />
    </div>
  );
};

export default ChartBasicLine;
