import * as React from 'react';

import { Card, Statistic } from 'antd';

interface ChartLabelProps {
  label: string;
  value: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  color?: string;
  precision?: number;
}

const ChartLabel: React.FC<ChartLabelProps> = ({ label, value, color, precision = 2, prefix, suffix }) => {
  return (
    <Card bordered={false}>
      <Statistic title={label} value={value} precision={precision} valueStyle={{ color: color }} prefix={prefix} suffix={suffix} />
    </Card>
  );
};

export default ChartLabel;
