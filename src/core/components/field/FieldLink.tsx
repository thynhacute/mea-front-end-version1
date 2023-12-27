import * as React from 'react';

import Link from 'next/link';

import _get from 'lodash/get';

interface FieldLinkProps {
  value: string;
  apiAction?: (value: any) => any;
  formatter?: (value: any) => any;
}

const FieldLink: React.FC<FieldLinkProps> = ({ value, apiAction }) => {
  const [link, setLink] = React.useState<string>('');
  const [label, setLabel] = React.useState<string>('');
  React.useEffect(() => {
    (async () => {
      if (apiAction) {
        const res = await apiAction(value);
        setLink(_get(res, 'link'));
        setLabel(_get(res, 'label'));
      }
    })();
  }, [apiAction, value]);
  return <div>{Boolean(link) ? <Link href={link}>{label}</Link> : <span>{label}</span>}</div>;
};

export default FieldLink;
