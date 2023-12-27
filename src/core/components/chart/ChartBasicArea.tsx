'use client';

import * as React from 'react';

import dynamic from 'next/dynamic';

import _get from 'lodash.get';

import { formatNumber } from '@/core/utils/number.helper';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartBasicAreaProps {
  values: {
    name: string;
    value: number[];
  }[];
  labels: string[];
  unit: string;
  title: string;
  colors: string[];
  length?: number;
}

const ChartBasicArea: React.FC<ChartBasicAreaProps> = ({ title, values, unit, colors, length = 1, labels }) => {
  return (
    <>
      <div className="w-full">
        <ReactApexChart
          height={420}
          width="100%"
          options={{
            chart: {
              fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
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
            labels: values.map((item) => item.name),
            xaxis: {
              labels: {
                formatter: (value: any) => {
                  return value;
                },
              },
            },
            yaxis: {
              labels: {
                formatter: (value: any) => {
                  return formatNumber(value);
                },
              },
            },
            legend: {
              horizontalAlign: 'left',
            },
            colors: colors,
          }}
          series={Array.from(Array(length).keys())
            .map((item) => {
              return values.map((subItem) => {
                return {
                  name: subItem.name,
                  data: _get(subItem, `value[${item}]`, 0),
                };
              });
            })
            .map((item, index) => {
              return {
                type: 'line',
                name: labels[index],
                data: item.map((subItem) => subItem.data),
              };
            })}
          type="area"
        />
      </div>
    </>
  );
};

export default ChartBasicArea;
