import * as React from 'react';

import _ from 'lodash';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { RootState } from '@/core/store';
import { ApiState } from '@/core/store/api/api.interface';

interface NKFieldWrapperProps {
  label: string;
  children: React.ReactNode;
  name: string;
  isShow: boolean;
  className?: string;
}

const NKFieldWrapper: React.FC<NKFieldWrapperProps> = ({ children, isShow, label, className, name }) => {
  const formMethods = useFormContext();
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const { errorDetails } = useSelector<RootState, ApiState>((state) => state.api);

  React.useEffect(() => {
    const error = _.get(formMethods.formState.errors, `${name}.message`, '') as string;
    if (error) {
      setErrorMessage(error);
      return;
    }

    if (errorDetails[name]) {
      setErrorMessage(errorDetails[name]);
      return;
    }
    const formatError = error.split(' ').slice(1).join(' ');
    setErrorMessage(formatError);
  }, [formMethods.formState.errors, errorDetails]);

  return (
    <div className="flex flex-col w-full gap-1">
      {isShow && <label className={className ? className : 'text-sm text-black'}>{label}</label>}
      {children}
      {Boolean(errorMessage) && (
        <div className="text-sm text-red-500">
          {label} {errorMessage}
        </div>
      )}
    </div>
  );
};

export default NKFieldWrapper;
