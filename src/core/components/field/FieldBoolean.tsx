import * as React from 'react';

import { Tag } from 'antd';
import clsx from 'clsx';

interface FieldBooleanProps {
  value: boolean;
}

const FieldBoolean: React.FC<FieldBooleanProps> = ({ value }) => {
  return (
    <div>
      <Tag color={value ? 'green' : 'red'}>{value ? 'Có' : 'Không'}</Tag>
    </div>
  );
};

export default FieldBoolean;
