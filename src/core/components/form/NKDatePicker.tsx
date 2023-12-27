import * as React from 'react';

import { DatePicker, DatePickerProps } from 'antd';
import { DatePickerType } from 'antd/lib/date-picker';
import { PickerBaseProps, PickerDateProps } from 'antd/lib/date-picker/generatePicker';
import dayjs from 'dayjs';
import { isDate } from 'lodash';
import moment from 'moment';
import { Controller, useFormContext } from 'react-hook-form';

import NKFieldWrapper from './NKFieldWrapper';

interface NKDatePickerProps {
  name: string;
  label: string;
  isShow?: boolean;
  labelClassName?: string;
  fieldProps?: any;
}

const NKDatePicker: React.FC<DatePickerProps & NKDatePickerProps> = ({ name, isShow = true, label, labelClassName, fieldProps = {}, ...rest }) => {
  const formMethods = useFormContext();

  return (
    <NKFieldWrapper className={labelClassName} isShow={isShow} label={label} name={name}>
      <div>
        <Controller
          name={name}
          control={formMethods.control}
          render={({ field }) => (
            <DatePicker
              format="DD/MM/YYYY"
              value={dayjs(field.value)}
              onChange={(date, dateString) => {
                if (dateString === '' || isDate(dateString)) {
                  field.onChange(new Date().toISOString());
                } else {
                  field.onChange(moment(dateString, 'DD/MM/YYYY').toDate().toISOString());
                }
              }}
              {...rest}
              className="w-full"
            />
          )}
        />
      </div>
    </NKFieldWrapper>
  );
};

export default NKDatePicker;
