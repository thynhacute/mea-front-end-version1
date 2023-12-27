export interface IPagingDto {
  page: number;
  pageSize: number;
  orderBy: string[];
  filters: string[];
}

export interface IReportDto {
  valuePath: string;
  filters: string[];
}

export interface ReportResponse {
  value: any;
  time: string;
}

export interface ResponseList<T> {
  count: number;
  data: T[];
  totalPage: number;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum FilterComparator {
  EQUAL = '=',
  NOT_EQUAL = '!=',
  LESS_THAN = '<',
  LESS_THAN_OR_EQUAL = '<=',
  GREATER_THAN = '>',
  GREATER_THAN_OR_EQUAL = '>=',
  IN = 'IN',
  NOT_IN = 'NOT IN',
  LIKE = 'LIKE',
}

export interface EnumListItem {
  id: any;
  label: string;
  color: string;
  slug: string;
  name: string;
  value: any;
}
