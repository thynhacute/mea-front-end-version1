import * as React from 'react';

import { nkMoment } from '@/core/utils/moment';

interface FieldTimeProps {
  value: any;
  format: string;
}

const FieldTime: React.FC<FieldTimeProps> = ({ value, format }) => {
  return <div>{nkMoment(value).format(format)}</div>;
};

export default FieldTime;
