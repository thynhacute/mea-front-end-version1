import _get from 'lodash/get';

import { nkMoment } from '@/core/utils/moment';

import { ReportResponse } from '../models/common';

export const groupCountValueByDate = (data: ReportResponse[]): Record<string, number> => {
  const result: any = {};
  data.forEach((item) => {
    const date = nkMoment(item.time).format('YYYY-MM-DD');
    if (result[date]) {
      result[date] += 1;
    } else {
      result[date] = 1;
    }
  });
  return result;
};

export const groupSumValueByDate = (data: ReportResponse[]): Record<string, number> => {
  const result: any = {};
  data.forEach((item) => {
    const date = nkMoment(item.time).format('YYYY-MM-DD');
    if (result[date]) {
      result[date] += item.value;
    } else {
      result[date] = item.value;
    }
  });
  return result;
};

export const groupSumValueByMonth = (data: ReportResponse[]): Record<string, number> => {
  const result: any = {};
  data.forEach((item) => {
    const date = nkMoment(item.time).format('YYYY-MM');
    if (result[date]) {
      result[date] += item.value;
    } else {
      result[date] = item.value;
    }
  });
  return result;
};

export const mapToList = (data: Array<Record<string, number>>): { time: string; value: number[] }[] => {
  const result: any = {};
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (result[key]) {
        result[key].push(_get(item, key, 0));
      } else {
        result[key] = [_get(item, key, 0)];
      }
    });
  });

  return Object.keys(result).map((key) => ({
    time: key,
    value: result[key],
  }));
};
