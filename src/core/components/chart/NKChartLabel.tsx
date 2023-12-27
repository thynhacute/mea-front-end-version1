import * as React from 'react';

import clsx from 'clsx';

import { formatNumber } from '@/core/utils/number.helper';

interface NKChartLabelProps {
  label: string;
  value: number;
  lastValue?: number;
  labelLastValue?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'indigo' | 'purple' | 'pink' | 'gray' | 'white' | 'black' | 'orange';
  precision?: number;
}

const NKChartLabel: React.FC<NKChartLabelProps> = ({ label, value, color, precision = 2, lastValue, prefix, suffix, labelLastValue }) => {
  return (
    <div
      className={clsx('p-4 text-white rounded-lg shadow-lg ', {
        'bg-red-500 shadow-red-500/70': color === 'red',
        'bg-blue-500 shadow-blue-500/70': color === 'blue',
        'bg-green-500 shadow-green-500/70': color === 'green',
        'bg-yellow-500 shadow-yellow-500/70': color === 'yellow',
        'bg-indigo-500 shadow-indigo-500/70': color === 'indigo',
        'bg-purple-500 shadow-purple-500/70': color === 'purple',
        'bg-pink-500 shadow-pink-500/70': color === 'pink',
        'bg-gray-500 shadow-gray-500/70': color === 'gray',
        'bg-white shadow-white-500/70': color === 'white',
        'bg-black shadow-black-500/70': color === 'black',
        'bg-orange-500 shadow-orange-500/70': color === 'orange',
      })}
    >
      <div className="text-lg font-semibold">{label}</div>
      <div className="flex items-center gap-2 mt-4">
        {prefix}
        <div className="text-3xl h-9">{formatNumber(value)}</div>
        {lastValue !== null && (
          <div className="flex items-end gap-2 pb-1 h-9">
            <span className="block h-4">từ</span>
            <div className="block h-[18px] text-sm font-semibold text-white">
              {formatNumber(lastValue || 0)}
              <span className="ml-1 font-normal">{labelLastValue}</span>
            </div>
          </div>
        )}

        {suffix}
      </div>
    </div>
  );
};

export default NKChartLabel;
