import * as React from 'react';

import _get from 'lodash/get';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { toast } from 'react-toastify';

interface NKFormWrapperProps {
  children: React.ReactNode;
  formMethods: UseFormReturn<any, any, undefined>;
  formActionError?: any;
  locale?: string;
}

const NKFormWrapper: React.FC<NKFormWrapperProps> = ({ children, formMethods, formActionError, locale = 'en' }) => {
  const { formState } = formMethods;

  React.useEffect(() => {
    const errorMessages = _get(formActionError, 'data.translation', {});
    const errorMessage = _get(errorMessages, locale, '');

    if (!Object.keys(formState.errors).length && errorMessage) {
      toast.error(errorMessage);
    }
  }, [formActionError, formState.errors]);

  return <FormProvider {...formMethods}>{children}</FormProvider>;
};

export default NKFormWrapper;
