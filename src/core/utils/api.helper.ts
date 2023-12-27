import _get from 'lodash/get';
import { toast } from 'react-toastify';

import { EnumListItem } from '../models/common';

export const toastError = (error: any) => {
  const message = _get(error, 'message', 'Lỗi hệ thống');

  toast.error(message);
};

export const getColorWithUuId = (uuid: string): string => {
  // 50 colors from material design
  const colorList = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#607d8b',
    '#ffeb3b',
    '#ffc107',
    '#e57373',
    '#f06292',
    '#ba68c8',
    '#9575cd',
    '#7986cb',
    '#64b5f6',
    '#4fc3f7',
    '#4dd0e1',
    '#4db6ac',
    '#81c784',
    '#a5d6a7',
    '#aed581',
    '#ff8a65',
    '#d4e157',
    '#dce775',
    '#fff176',
    '#ffd54f',
    '#ffb74d',
    '#ff8f00',
    '#a1887f',
    '#90a4ae',
    '#e84e40',
    '#ec407a',
    '#ab47bc',
    '#7e57c2',
    '#5c6bc0',
    '#42a5f5',
    '#29b6f6',
    '#26c6da',
    '#26a69a',
    '#66bb6a',
    '#9ccc65',
    '#d4e157',
    '#ffee58',
    '#ffa726',
    '#8d6e63',
    '#bdbdbd',
    '#78909c',
  ];

  const index = uuid
    .split('')
    .map((char) => char.charCodeAt(0))
    .reduce((current, previous) => current + previous, 0);

  return colorList[index % colorList.length];
};

export const mapListToOptions = (list: any[], labelKey = 'name', valueKey = 'id'): EnumListItem[] => {
  return list.map((item) => ({
    label: item[labelKey],
    value: item[valueKey],
    color: getColorWithUuId(item[valueKey]),
    id: item[valueKey],
    name: item[labelKey],
    slug: item[valueKey],
  }));
};

export const addNoSelectOption = (list: EnumListItem[], label = 'Không Có'): EnumListItem[] => {
  return [
    {
      label,
      value: '',
      color: '#000',
      id: '',
      name: label,
      slug: label,
    },
    ...list,
  ];
};
