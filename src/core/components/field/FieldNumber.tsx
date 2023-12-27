import * as React from 'react';

interface FieldNumberProps {
  value: string;
}

const FieldNumber: React.FC<FieldNumberProps> = ({ value }) => {
  return <div>{String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>;
};

export default FieldNumber;
