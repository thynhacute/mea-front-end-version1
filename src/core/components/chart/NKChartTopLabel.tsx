import * as React from 'react';

import clsx from 'clsx';

interface NKChartTopLabelProps {
  label: string;
  value: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'indigo' | 'purple' | 'pink' | 'gray' | 'white' | 'black';
  precision?: number;
}

const NKChartTopLabel: React.FC<NKChartTopLabelProps> = ({ label, value, color, precision = 2, prefix, suffix }) => {
  return (
    <div
      className={clsx('p-2  rounded-lg  ', {
        'text-red-500 ': color === 'red',
        'text-blue-500 ': color === 'blue',
        'text-green-500 ': color === 'green',
        'text-yellow-500 ': color === 'yellow',
        'text-indigo-500 ': color === 'indigo',
        'text-purple-500 ': color === 'purple',
        'text-pink-500 ': color === 'pink',
        'text-gray-500 ': color === 'gray',
        'text-white ': color === 'white',
        'text-black': color === 'black',
      })}
    >
      <div className="flex items-center gap-2 text-sm font-semibold ">
        {prefix}
        <div className="">{label}</div>
        <div className="">{value}</div>
        {suffix}
      </div>
    </div>
  );
};

export default NKChartTopLabel;
