import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import { Tag } from 'antd/lib';
import { kebabCase } from 'lodash';

interface FieldBadgeApiProps {
  value: any;
  apiAction?: (data?: any) => Promise<any[]>;
  key?: string;
}

const FieldBadgeApi: React.FC<FieldBadgeApiProps> = ({ value, apiAction, key }) => {
  const [label, setLabel] = React.useState<string>('Không có');
  const [color, setColor] = React.useState<string>('red');

  const options = useQuery(['options-field', kebabCase(apiAction?.toString()), key, value], async () => {
    return apiAction ? apiAction() : Promise.resolve([]);
  });

  React.useEffect(() => {
    if (options.data && value) {
      const option = options.data.find((item) => item.value === value);
      if (option) {
        setLabel(option.label);
        setColor(option.color);
      }
    }
  }, [options, value]);

  return (
    <Tag color={color} className="whitespace-break-spaces">
      {label}
    </Tag>
  );
};

export default FieldBadgeApi;
