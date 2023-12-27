import * as React from 'react';

import _ from 'lodash';

import NKAutoCompleteApiOption from './NKAutoCompleteApiOption';
import NKBooleanInput from './NKBooleanInput';
import NKDatePicker from './NKDatePicker';
import NKInputNumber from './NKInputNumber';
import NKRichText from './NKRichText';
import NKSelectApiOption from './NKSelectApiOption';
import NKSelectMultipleApiOption from './NKSelectMultipleApiOption';
import NKTextField from './NKTextField';
import NKTextareaField from './NKTextareaField';
import NKUploadImage from './NKUploadImage';
import NKUploadMultipleImage from './NKUploadMultipleImage';
import NKWatchDisplay from './NKWatchDislay';

export enum NKFormType {
  TEXT = 'text',
  PASSWORD = 'password',
  TEXTAREA = 'textarea',
  DATE = 'date',
  DATE_TIME = 'date_time',
  DATE_WEEK = 'date_week',
  DATE_MONTH = 'date_month',
  DATE_QUARTER = 'date_quarter',
  DATE_YEAR = 'date_year',
  SELECT_API_OPTION = 'select_api_option',
  UPLOAD_IMAGE = 'upload_image',
  MULTI_UPLOAD_IMAGE = 'multi_upload_image',
  AUTO_COMPLETE = 'auto_complete',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  RICH_TEXT = 'rich_text',
  SELECT_MULTI_API_OPTION = 'select_multi_api_option',
  WATCH_DISPLAY = 'watch_display',
}

interface NKFormProps {
  type: NKFormType;
  name: string;
  label: string;
  fieldProps?: any;
  apiAction?: (value: any) => any;
}

const NKForm: React.FC<NKFormProps> = ({ label, name, type, apiAction, fieldProps }) => {
  switch (type) {
    case NKFormType.TEXT:
      return <NKTextField name={name} label={label} fieldProps={fieldProps} />;
    case NKFormType.TEXTAREA:
      return <NKTextareaField name={name} label={label} fieldProps={fieldProps} />;
    case NKFormType.PASSWORD:
      return <NKTextField name={name} label={label} type="password" fieldProps={fieldProps} />;
    case NKFormType.DATE:
      return <NKDatePicker name={name} label={label} fieldProps={fieldProps} />;
    case NKFormType.DATE_TIME:
      return <NKDatePicker name={name} label={label} showTime fieldProps={fieldProps} />;
    case NKFormType.DATE_WEEK:
      return <NKDatePicker name={name} label={label} picker="week" fieldProps={fieldProps} />;
    case NKFormType.DATE_MONTH:
      return <NKDatePicker name={name} label={label} picker="month" fieldProps={fieldProps} />;
    case NKFormType.DATE_QUARTER:
      return <NKDatePicker name={name} label={label} picker="quarter" fieldProps={fieldProps} />;
    case NKFormType.DATE_YEAR:
      return <NKDatePicker name={name} label={label} picker="year" fieldProps={fieldProps} />;
    case NKFormType.UPLOAD_IMAGE:
      return <NKUploadImage name={name} label={label} maxCount={1} fieldProps={fieldProps} />;
    case NKFormType.NUMBER:
      return <NKInputNumber name={name} label={label} fieldProps={fieldProps} />;
    case NKFormType.MULTI_UPLOAD_IMAGE:
      return <NKUploadMultipleImage name={name} label={label} fieldProps={fieldProps} />;
    case NKFormType.BOOLEAN:
      return <NKBooleanInput name={name} label={label} fieldProps={fieldProps} />;
    case NKFormType.RICH_TEXT:
      return <NKRichText name={name} label={label} />;
    case NKFormType.WATCH_DISPLAY:
      return <NKWatchDisplay name={name} label={label} apiAction={apiAction} />;

    case NKFormType.AUTO_COMPLETE:
      return (
        <NKAutoCompleteApiOption
          name={name}
          label={label}
          apiAction={apiAction}
          fieldProps={{
            ...fieldProps,
          }}
        />
      );

    case NKFormType.SELECT_API_OPTION:
      return (
        <NKSelectApiOption
          name={name}
          label={label}
          apiAction={apiAction}
          fieldProps={{
            isAllOption: false,
            ...fieldProps,
          }}
        />
      );

    case NKFormType.SELECT_MULTI_API_OPTION:
      return (
        <NKSelectMultipleApiOption
          name={name}
          label={label}
          apiAction={apiAction}
          fieldProps={{
            isAllOption: true,
            ...fieldProps,
          }}
        />
      );

    default:
      return <NKTextField name={name} label={label} />;
  }
};

export default NKForm;
