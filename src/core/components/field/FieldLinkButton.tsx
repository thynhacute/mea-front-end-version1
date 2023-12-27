import * as React from 'react';

import Link from 'next/link';

import Tippy from '@tippyjs/react';

interface FieldLinkButtonProps {
  value: string;
  label?: string;
}

const FieldLinkButton: React.FC<FieldLinkButtonProps> = ({ value, label }) => {
  return (
    <Tippy content={value} placement="top-start" interactive>
      <Link target="_blank" href={value}>
        {label ? label : value.slice(0, 20)}
      </Link>
    </Tippy>
  );
};

export default FieldLinkButton;
