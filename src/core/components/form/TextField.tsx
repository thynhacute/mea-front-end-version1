import * as React from 'react';

interface TextFieldProps {
  children: React.ReactNode;
}

export const TextField: React.FC<TextFieldProps> = ({ children }) => {
  return <div>{children}</div>;
};
