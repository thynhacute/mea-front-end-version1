import * as React from 'react';

import dynamic from 'next/dynamic';

import { formatNumber } from '@/core/utils/number.helper';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ColumnChartBasicProps {
  values: {
    name: string;
    data: number;
  }[];
  unit: string;
  title: string;
}

const ColumnChartBasic: React.FC<ColumnChartBasicProps> = ({ title, values, unit }) => {
  return (
    <div>
      <ReactApexChart
        options={{
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '5%',
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["'transparent'"],
          },
          xaxis: {
            categories: values.map((item) => item.name),
          },
          yaxis: {
            title: {
              text: unit,
            },
          },
          title: {
            text: title,
            align: 'left',
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return formatNumber(val) + ' ' + unit;
              },
            },
          },
          colors: ['#f1c40f', '#e74c3c', '#2ecc71', '#9b59b6'],
        }}
        series={[
          {
            name: unit,
            data: values.map((item) => item.data),
          },
        ]}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default ColumnChartBasic;
