import * as React from 'react';

import Tippy from '@tippyjs/react';

interface FieldUuidProps {
  value: string;
}

const FieldUuid: React.FC<FieldUuidProps> = ({ value }) => {
  return (
    <Tippy content={value} placement="top-start" interactive>
      <div className="inline-block">{value.slice(0, 8)}</div>
    </Tippy>
  );
};

export default FieldUuid;
