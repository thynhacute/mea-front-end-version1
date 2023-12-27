import * as React from 'react';

interface FieldTextProps {
  value: string;
}

const FieldText: React.FC<FieldTextProps> = ({ value }) => {
  if (!value) {
    return <div className="text-gray-300">Trống</div>;
  }

  return <div>{value}</div>;
};

export default FieldText;
