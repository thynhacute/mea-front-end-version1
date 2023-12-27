import { lowercaseFirstLetter } from './string.helper';

export const lowerCaseField = (json: Record<string, any>) => {
  const result: Record<string, any> = {};
  Object.keys(json).forEach((key) => {
    result[lowercaseFirstLetter(key)] = json[key];
  });
  return result;
};

export const isSame = (value: any, compareValue: any) => {
  return value === compareValue;
};
