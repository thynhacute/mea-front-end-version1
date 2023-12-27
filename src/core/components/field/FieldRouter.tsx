import * as React from 'react';

import Link from 'next/link';

import _get from 'lodash/get';

interface FieldRouterProps {
  value: any;
  apiAction?: (data?: any) => any;
}

const FieldRouter: React.FC<FieldRouterProps> = ({ value, apiAction }) => {
  const [link, setLink] = React.useState<any>('');
  const name = _get(value, 'name');

  React.useEffect(() => {
    if (apiAction && value) {
      const id = _get(value, 'id');
      apiAction(id).then((data: any) => {
        setLink(data);
      });
    }
  }, [value, apiAction]);

  return <Link href={link}>{name}</Link>;
};

export default FieldRouter;
