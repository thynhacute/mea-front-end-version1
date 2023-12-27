import * as React from 'react';

import { FilterOutlined, MenuOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import { useQuery } from '@tanstack/react-query';
import { Button, Dropdown, Table } from 'antd';
import { AnyObject } from 'antd/lib/_util/type';
import Sider from 'antd/lib/layout/Sider';
import Layout, { Content } from 'antd/lib/layout/layout';
import { ColumnType } from 'antd/lib/table';
import clsx from 'clsx';
import { flatten } from 'flat';
import _get from 'lodash/get';
import { FormProvider, useForm } from 'react-hook-form';

import { FilterComparator, IPagingDto, ResponseList, SortOrder } from '@/core/models/common';

import FieldDisplay, { FieldType } from '../field/FieldDisplay';
import NKForm, { NKFormType } from '../form/NKForm';

export interface TableBuilderColumn extends ColumnType<AnyObject> {
  type: FieldType;
  key: string;
  apiAction?: (value: any) => Promise<any[]>;
  formatter?: (value: any) => any;
}

export interface IFilterItem {
  name: string;
  filterName?: string;
  type: NKFormType;
  label: string;
  comparator: FilterComparator;
  defaultValue?: any;
  apiAction?: (value: any) => Promise<any>;
}

export interface IActionColum {
  label: string;
  onClick: (record: any) => void;
  isShow?: (record: any) => boolean;
}

interface TableBuilderProps {
  title: string;
  extraFilter?: string[];
  sourceKey: string;
  queryApi: (dto: IPagingDto) => Promise<ResponseList<any>>;
  columns: TableBuilderColumn[];
  onBack?: () => void;
  filters?: IFilterItem[];
  pageSizes?: number[];
  tableSize?: 'small' | 'middle' | 'large';
  extraButtons?: React.ReactNode;
  isAllowBulkActions?: boolean;
  extraBulkActions?: (selectRows: any[], setSelectRows: React.Dispatch<React.SetStateAction<any[]>>) => React.ReactNode;
  actionColumns?: Array<IActionColum>;
}

const TableBuilder: React.FC<TableBuilderProps> = ({
  sourceKey,
  title,
  queryApi,
  columns,
  extraFilter = [],
  onBack,
  pageSizes = [10],
  tableSize = 'middle',
  filters = [],
  extraBulkActions = () => null,
  isAllowBulkActions = false,
  extraButtons,
  actionColumns,
}) => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(pageSizes[0]);
  const [order, setOrder] = React.useState<SortOrder>(SortOrder.DESC);
  const [orderBy, setOrderBy] = React.useState<string>('createdAt');
  const [isShowFilter, setIsShowFilter] = React.useState(false);
  const [selectedRowGroup, setSelectedRowGroup] = React.useState<any[]>([]);
  const defaultValues = React.useMemo(() => {
    const defaultValues: Record<any, any> = filters.reduce((acc: any, item: any) => {
      acc[item.name] = item.defaultValue;

      return acc;
    }, {});

    return defaultValues;
  }, []);

  const formMethods = useForm({ defaultValues });

  React.useEffect(() => {
    if (extraFilter.length !== 0) {
      setPage(1);
    }
  }, [extraFilter]);

  const pagingQuery = useQuery(
    [sourceKey, 'paging', page, pageSize, order, orderBy, extraFilter, formMethods.getValues()],
    () => {
      const filterValues = flatten(formMethods.getValues()) as Record<string, any>;

      return queryApi({
        page: page - 1,
        pageSize,
        orderBy: orderBy ? [`${orderBy}||${order}`] : [`createdAt||${SortOrder.DESC}`],
        filters: [
          ...Object.keys(filterValues)
            .map((key) => {
              const value = filterValues[key];
              const filterKey = filters.find((item) => item.name === key)?.filterName || key;

              if (value === undefined || value === null || value === '') {
                return undefined;
              }

              return {
                name: filterKey,
                value,
                comparator: filters.find((item) => item.name === key)?.comparator || FilterComparator.EQUAL,
              };
            })
            .filter((item) => item !== undefined)
            .map((item) => `${item?.name}||${item?.comparator}||${item?.value}`),
          ...extraFilter,
        ],
      });
    },
    {
      initialData: {
        count: 0,
        data: [],
        totalPage: 0,
      },
    },
  );

  if (pagingQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-4 fade-in">
      <Layout>
        {isShowFilter && (
          <Sider collapsed={!isShowFilter} theme="light" className="mt-[53px] fade-in p-4" width={250}>
            <FormProvider {...formMethods}>
              <div className="flex flex-col gap-2">
                {filters.map((item) => {
                  return (
                    <NKForm
                      key={item.name}
                      name={item.name}
                      label={item.label}
                      type={item.type}
                      apiAction={item.apiAction}
                      fieldProps={{
                        isAllOption: true,
                      }}
                    />
                  );
                })}

                <div className="flex gap-4">
                  <Button
                    className="w-full"
                    size="small"
                    type="primary"
                    onClick={() => {
                      pagingQuery.refetch();
                    }}
                  >
                    Lọc
                  </Button>
                  <Button
                    className="w-full"
                    size="small"
                    onClick={() => {
                      formMethods.reset();
                    }}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            </FormProvider>
          </Sider>
        )}
        <Content
          className={clsx('', {
            'ml-4': isShowFilter,
          })}
        >
          <div>
            <PageHeader
              title={title}
              onBack={onBack}
              extra={[
                selectedRowGroup.length === 0 ? null : (
                  <React.Fragment key="3">{extraBulkActions(selectedRowGroup, setSelectedRowGroup)}</React.Fragment>
                ),
                extraButtons,
                <Button
                  key="2"
                  type="default"
                  icon={<ReloadOutlined rev="" />}
                  onClick={() => {
                    pagingQuery.refetch();
                  }}
                >
                  Làm mới
                </Button>,
                filters.length === 0 ? null : (
                  <Button
                    onClick={() => {
                      setIsShowFilter(!isShowFilter);
                    }}
                    type="primary"
                    key="1"
                    icon={<FilterOutlined rev="" />}
                  >
                    Bộ lọc
                  </Button>
                ),
              ]}
            />

            <Table
              bordered
              sticky
              rowSelection={
                isAllowBulkActions
                  ? {
                      type: 'checkbox',
                      onChange(selectedRowKeys, selectedRows, info) {
                        setSelectedRowGroup(selectedRows);
                      },
                      selectedRowKeys: selectedRowGroup.map((item) => item.id),
                    }
                  : undefined
              }
              sortDirections={['ascend', 'descend']}
              rowKey={(record) => _get(record, 'id', '')}
              size={tableSize}
              dataSource={pagingQuery.data.data}
              columns={[
                ...columns.map((item, index) => ({
                  ...item,
                  key: item.key,
                  title: item.title,

                  render: (value: any, record: any) => {
                    const formatValue = _get(record, item.key, '');

                    return <FieldDisplay key={item.key} type={item.type} formatter={item.formatter} value={formatValue} apiAction={item.apiAction} />;
                  },

                  sorter: true,
                })),
                {
                  key: 'action',
                  title: '',
                  sorter: false,
                  width: 100,
                  render: (value: any, record: any) => {
                    if (!actionColumns) {
                      return null;
                    }

                    const filteredActionColumns = actionColumns.filter((item) => {
                      if (item.isShow) {
                        return item.isShow(record);
                      }

                      return true;
                    });

                    return (
                      <Dropdown
                        menu={{
                          items: (filteredActionColumns || []).map((item) => ({
                            type: 'item',
                            label: item.label,
                            onClick: () => {
                              item.onClick(record);
                            },
                          })) as any,
                        }}
                        placement="bottomRight"
                      >
                        <Button icon={<MenuOutlined rev="" />}></Button>
                      </Dropdown>
                    );
                  },
                },
              ]}
              pagination={{
                current: page,
                pageSize,
                total: pagingQuery.data.count,
              }}
              loading={pagingQuery.isLoading}
              onChange={(pagination, filters, sorter, extra) => {
                if (sorter) {
                  const sortKey = _get(sorter, 'columnKey', '');
                  const sortOrder = _get(sorter, 'order', undefined);

                  if (sortOrder) {
                    setOrderBy(sortKey);
                    setOrder(sortOrder === 'ascend' ? SortOrder.ASC : SortOrder.DESC);
                  } else {
                    setOrderBy('createdAt');
                    setOrder(SortOrder.ASC);
                  }
                }

                setPage(pagination.current || 0);
                if (pagination.pageSize !== pageSize) {
                  setPage(1);
                  setPageSize(pagination.pageSize || pageSizes[0]);
                }
              }}
            />
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default TableBuilder;
