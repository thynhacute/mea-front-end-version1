'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, ExportOutlined, PaperClipOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Table, Tabs } from 'antd';
import { Descriptions } from 'antd';
import joi from 'joi';
import _get from 'lodash/get';
import { FormProvider, UseFormReturn, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { NKRouter } from '@/core/NKRouter';
import { departmentApi } from '@/core/api/department.api';
import { equipmentApi } from '@/core/api/equipment.api';
import { ExportInventoryIV1CreateDto, exportInventoryApi } from '@/core/api/export-inventory';
import { ImportPlanItemIV1CreateDto, ImportPlanItemIV1UpdateDto, importPlanApi } from '@/core/api/import-plan.api';
import {
  ImportRequestIV1UpdateDto,
  ImportRequestItemIV1CreateDto,
  ImportRequestItemIV1UpdateDto,
  ImportRequestV1ApproveDto,
  ImportRequestV1CancelDto,
  importRequestApi,
} from '@/core/api/import-request';
import { supplyApi } from '@/core/api/supply.api';
import CTAButton from '@/core/components/cta/CTABtn';
import CTAExportXLSXTable from '@/core/components/cta/CTAExportXLSXTable';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FieldDisplay from '@/core/components/field/FieldDisplay';
import FiledFirstImages from '@/core/components/field/FieldFirstImages';
import FieldNumber from '@/core/components/field/FieldNumber';
import FieldText from '@/core/components/field/FieldText';
import FormBuilder from '@/core/components/form/FormBuilder';
import NKForm, { NKFormType } from '@/core/components/form/NKForm';
import NKFormWrapper from '@/core/components/form/NKFormWrapper';
import NKSelectApiOption from '@/core/components/form/NKSelectApiOption';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { useBooleanWatcher } from '@/core/hooks/useBooleanWatcher';
import { EnumListItem } from '@/core/models/common';
import { Equipment } from '@/core/models/equipment';
import { ImportPlan } from '@/core/models/importPlan';
import { ImportPlanItem } from '@/core/models/importPlanItem';
import { ImportRequest } from '@/core/models/importRequest';
import { ImportRequestItem } from '@/core/models/importRequestItem';
import { Supply } from '@/core/models/supply';
import { RootState } from '@/core/store';
import { apiActions } from '@/core/store/api';
import { UserState } from '@/core/store/user';
import { addNoSelectOption, mapListToOptions } from '@/core/utils/api.helper';
import { nkMoment } from '@/core/utils/moment';

const ImportRequestAddItem = ({ id, close, refetch }: { id: string; close: () => void; refetch: () => void }) => {
  const formMethods = useForm<ImportRequestItemIV1CreateDto>({
    defaultValues: {
      equipmentId: '',
      quantity: 1,
      supplyId: '',
    },
  });
  const supplyId = formMethods.watch('supplyId');
  const [supply, setSupply] = React.useState<Supply | undefined>();

  React.useEffect(() => {
    if (supplyId) {
      supplyApi.v1GetById(supplyId).then((res) => {
        setSupply(res);
      });
    }
  }, [supplyId]);

  const mutate = useMutation(
    async (dto: ImportRequestItemIV1CreateDto) => {
      const res = await importRequestApi.v1CreateItem(id, {
        ...dto,
        equipmentId: dto.equipmentId || null,
        supplyId: dto.supplyId || null,
      });

      return res;
    },
    {
      onSuccess: (data) => {
        toast.success('Tạo sản phẩm thành công');
        refetch();

        close();
      },
      onError: (error) => {
        const message = _get(error, 'data.message', '');
        if (message) toast.error(message);
      },
    },
  );

  return (
    <FormProvider {...formMethods}>
      <form
        className="flex flex-col gap-4 p-4 bg-white rounded-lg fade-in"
        onSubmit={formMethods.handleSubmit((value) => {
          mutate.mutate(value);
        })}
      >
        <div className="grid gap-4">
          <NKSelectApiOption
            name="supplyId"
            label="Tên Hàng"
            apiAction={async (data) => {
              const res = await supplyApi.v1Select(data);

              return res.map((e) => {
                return {
                  ...e,
                  name: `${e.name} - (${e.quantity} ${e.unit})`,
                };
              });
            }}
            fieldProps={{
              isAllOption: false,
            }}
          />
          {supply && (
            <div>
              Số lượng trong kho: {supply.quantity} {supply.unit}
            </div>
          )}
          <NKForm name="quantity" label="SL yêu cầu" type={NKFormType.NUMBER} />
        </div>

        <Button type="primary" htmlType="submit" loading={mutate.isLoading}>
          Tạo
        </Button>
      </form>
    </FormProvider>
  );
};

const ImportRequestUpdateItem = ({ id, close, refetch, item }: { id: string; close: () => void; refetch: () => void; item: ImportRequestItem }) => {
  const formMethods = useForm<ImportRequestItemIV1UpdateDto>({
    defaultValues: {
      quantity: item.quantity,
    },
  });

  const mutate = useMutation(
    async (dto: ImportRequestItemIV1UpdateDto) => {
      const res = await importRequestApi.v1UpdateItem(id, item.id, {
        ...dto,
        equipmentId: item.equipment?.id || null,
        supplyId: item.supply?.id || null,
      });

      return res;
    },
    {
      onSuccess: (data) => {
        toast.success('Cập nhật sản phẩm thành công');
        refetch();

        close();
      },
      onError: (error) => {
        const message = _get(error, 'data.message', '');
        if (message) toast.error(message);
      },
    },
  );

  return (
    <FormProvider {...formMethods}>
      <form
        className="flex flex-col gap-4 p-4 bg-white rounded-lg fade-in"
        onSubmit={formMethods.handleSubmit((value) => {
          mutate.mutate(value);
        })}
      >
        <div className="grid gap-4">
          <NKForm name="quantity" label="SL yêu cầu" type={NKFormType.NUMBER} />
        </div>

        <Button type="primary" htmlType="submit" loading={mutate.isLoading}>
          Cập nhật
        </Button>
      </form>
    </FormProvider>
  );
};

interface CreateFormProps {
  close: () => void;
  importRequest: ImportRequest | undefined;
}

const CreateForm = ({ close, importRequest }: CreateFormProps) => {
  const router = useRouter();

  const formMethods = useForm<ExportInventoryIV1CreateDto>({
    defaultValues: {
      exportDate: nkMoment().format('YYYY-MM-DD'),
      departmentId: '',
      importRequestId: '',
      note: '',
    },
  });

  React.useEffect(() => {
    formMethods.setValue('importRequestId', importRequest?.id || '');
    formMethods.setValue('departmentId', importRequest?.department?.id || '');
  }, [importRequest]);

  const mutate = useMutation(
    async (dto: ExportInventoryIV1CreateDto) => {
      const res = await exportInventoryApi.v1Create(dto);
      const id = _get(res, 'id');

      return res;
    },
    {
      onSuccess: (data) => {
        const id = _get(data, 'id');
        toast.success('Tạo phiếu xuất kho thành công');
        if (id) {
          router.push(NKRouter.exportInventory.detail(id));
        }
        close();
      },
    },
  );

  return (
    <div>
      <form
        className="flex flex-col gap-4 p-4 bg-white rounded-lg fade-in"
        onSubmit={formMethods.handleSubmit((data) => {
          mutate.mutate(data);
        })}
      >
        <div className="mb-2 text-2xl font-bold">Tạo phiếu xuất kho</div>
        <NKFormWrapper formMethods={formMethods} formActionError={mutate.error}>
          <div className="grid gap-4">
            <NKForm name="exportDate" label="Ngày xuất kho" type={NKFormType.DATE} />

            <NKForm name="note" label="Mô tả" type={NKFormType.TEXTAREA} />
          </div>
        </NKFormWrapper>
        <Button type="primary" htmlType="submit" loading={mutate.isLoading}>
          Tạo
        </Button>
      </form>
    </div>
  );
};
interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const id = _get(params, 'id') as string;
  const [equipments, setEquipments] = React.useState<Equipment[]>([]);
  const [supplies, setSupplies] = React.useState<Supply[]>([]);
  const router = useRouter();
  const [formMethods, setFormMethods] = React.useState<UseFormReturn<any, any, undefined>>();
  const userStoreState = useSelector<RootState, UserState>((state) => state.user);
  const [selectedRowGroup, setSelectedRowGroup] = React.useState<ImportRequestItem[]>([]);
  const queryData = useQuery(
    ['import-request', id],
    () => {
      return importRequestApi.v1GetById(id);
    },
    {},
  );
  const isDraft = useBooleanWatcher(queryData.data?.status, 'DRAFT');
  const isRequesting = useBooleanWatcher(queryData.data?.status, 'REQUESTING');
  const isUpdated = useBooleanWatcher(queryData.data?.status, 'UPDATED');
  const isApproved = useBooleanWatcher(queryData.data?.status, 'APPROVED');
  const isCompleted = useBooleanWatcher(queryData.data?.status, 'COMPLETED');
  const isSelect = selectedRowGroup.length > 0;

  const deleteMutation = useMutation(
    (id: string) => {
      return importRequestApi.v1Delete(id);
    },
    {
      onSuccess: () => {
        toast.success('Xoá thành công');
      },
      onError: (error) => {
        const message = _get(error, 'data.message', '');
        if (message) toast.error(message);
      },
    },
  );

  if (queryData.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full gap-4 ">
      <FieldBuilder<ImportRequest>
        fields={[
          {
            key: 'name',
            label: 'Tên Yêu Cầu',
            type: FieldType.TEXT,
            span: 2,
          },
          {
            key: 'department.id',
            label: 'Phòng ban',
            type: FieldType.BADGE_API,
            span: 1,
            apiAction: async () => mapListToOptions(await departmentApi.v1GetSelect('')),
          },
          {
            key: 'status',
            label: 'Trạng thái',
            type: FieldType.BADGE_API,
            apiAction: importRequestApi.v1GetEnumStatus,
            span: 1,
          },
          {
            key: 'expected',
            label: 'Thời gian dự kiến',
            type: FieldType.BADGE_API,
            apiAction: importRequestApi.v1GetEnumExpected,
            span: 2,
          },
          {
            key: 'createdBy.name',
            label: 'Người tạo',
            type: FieldType.TEXT,
            span: 1,
          },

          {
            label: 'Ngày tạo',
            key: 'createdAt',
            type: FieldType.TIME_FULL,
            span: 2,
          },

          {
            key: 'updatedBy.name',
            label: 'Người cập nhật cuối',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            label: 'Ngày cập nhật',
            key: 'updatedAt',
            type: FieldType.TIME_FULL,
            span: 2,
          },

          {
            label: 'Mô tả',
            key: 'description',
            type: FieldType.MULTILINE_TEXT,
            span: 3,
          },
          {
            label: 'Ghi chú',
            key: 'note',
            type: FieldType.MULTILINE_TEXT,
            span: 3,
          },
        ]}
        record={queryData.data}
        extra={
          <div className="flex items-center gap-4">
            {isUpdated && (userStoreState.isAdmin || userStoreState.isInventoryManager) && (
              <>
                <CTAButton
                  extraOnSuccess={() => {
                    queryData.refetch();
                  }}
                  ctaApi={() => {
                    return importRequestApi.v1UpdateApprove(queryData?.data?.id || '', {
                      note: queryData.data?.note || '',
                    });
                  }}
                  isConfirm
                  confirmMessage="Bạn có muốn duyệt yêu cầu này?"
                >
                  <Button type="primary" icon={<CheckOutlined rev="" />}>
                    Duyệt Yêu Cầu
                  </Button>
                </CTAButton>
                {/* <ModalBuilder
                  modalTitle="Duyệt Yêu Cầu"
                  btnLabel="Duyệt Yêu Cầu"
                  btnProps={{
                    icon: <CheckOutlined rev="" />,
                    type: 'primary',
                  }}
                >
                  <FormBuilder<ImportRequestV1ApproveDto>
                    apiAction={(dto) => {
                      return importRequestApi.v1UpdateApprove(queryData?.data?.id || '', dto);
                    }}
                    defaultValues={{
                      note: '',
                    }}
                    onExtraSuccessAction={() => {
                      queryData.refetch();
                    }}
                    fields={[
                      {
                        label: 'Ghi chú',
                        name: 'note',
                        span: 3,
                        type: NKFormType.TEXTAREA,
                      },
                    ]}
                    title=""
                    btnLabel="Xác nhận"
                  />
                </ModalBuilder> */}
              </>
            )}

            {(isRequesting || isUpdated) && (userStoreState.isAdmin || userStoreState.isInventoryManager || userStoreState.isFacilityManager) && (
              <>
                <ModalBuilder
                  modalTitle="Từ Chối Yêu Cầu"
                  btnLabel="Từ Chối Yêu Cầu"
                  btnProps={{
                    icon: <CloseOutlined rev="" />,
                    type: 'primary',
                    danger: true,
                  }}
                >
                  <FormBuilder<ImportRequestV1CancelDto>
                    apiAction={(dto) => {
                      return importRequestApi.v1UpdateCancel(queryData?.data?.id || '', dto);
                    }}
                    defaultValues={{
                      note: '',
                    }}
                    onExtraSuccessAction={() => {
                      queryData.refetch();
                    }}
                    fields={[
                      {
                        label: 'Ghi chú',
                        name: 'note',
                        span: 3,
                        type: NKFormType.TEXTAREA,
                      },
                    ]}
                    title=""
                    btnLabel="Xác nhận"
                  />
                </ModalBuilder>
              </>
            )}

            {isRequesting && (
              <>
                <ModalBuilder
                  btnLabel="Cập Nhật Yêu Cầu"
                  modalTitle={`Cập Nhật Yêu Cầu`}
                  btnProps={{
                    type: 'primary',
                    icon: <PaperClipOutlined rev="" />,
                  }}
                >
                  <FormBuilder<ImportRequestV1ApproveDto>
                    apiAction={(dto) => {
                      return importRequestApi.v1UpdateUpdated(id, dto);
                    }}
                    onExtraSuccessAction={() => {
                      queryData.refetch();
                    }}
                    setFormMethods={(data) => setFormMethods(data)}
                    btnLabel="Xác nhận"
                    fields={[
                      {
                        label: 'Ghi chú',
                        name: 'note',
                        type: NKFormType.TEXTAREA,
                        span: 3,
                      },
                    ]}
                    title=""
                    defaultValues={{
                      note: '',
                    }}
                  />
                </ModalBuilder>
              </>
            )}

            {isDraft && (
              <>
                <CTAButton
                  extraOnSuccess={() => {
                    queryData.refetch();
                  }}
                  ctaApi={() => {
                    return importRequestApi.v1UpdateSubmit(queryData?.data?.id || '');
                  }}
                  isConfirm
                  confirmMessage="Bạn có muốn gửi yêu cầu này?"
                >
                  <Button type="primary" icon={<PaperClipOutlined rev="" />}>
                    Gửi Yêu Cầu
                  </Button>
                </CTAButton>
              </>
            )}
            {isDraft && (
              <ModalBuilder
                btnLabel="Chỉnh sửa"
                modalTitle={``}
                btnProps={{
                  size: 'middle',
                  type: 'default',
                }}
              >
                {(close) => (
                  <FormBuilder<ImportRequestIV1UpdateDto>
                    apiAction={(data) => {
                      return importRequestApi.v1Update(id, data);
                    }}
                    fields={[
                      {
                        label: 'Tên',
                        name: 'name',
                        type: NKFormType.TEXT,
                        span: 3,
                      },
                      {
                        label: 'Mô tả',
                        name: 'description',
                        type: NKFormType.TEXTAREA,
                        span: 3,
                      },
                      {
                        label: 'Phòng ban',
                        name: 'departmentId',
                        type: NKFormType.SELECT_API_OPTION,
                        useAction: departmentApi.v1GetSelect,
                        span: 3,
                      },
                      {
                        label: 'Thời gian dự kiến',
                        name: 'expected',
                        type: NKFormType.SELECT_API_OPTION,
                        useAction: importRequestApi.v1GetEnumExpected,
                        span: 3,
                      },
                    ]}
                    defaultValues={{
                      name: queryData.data?.name || '',
                      description: queryData.data?.description || '',
                      departmentId: queryData.data?.department?.id || '',
                      expected: queryData.data?.expected || '',
                    }}
                    title="Cập nhật yêu cầu đặt thiết bị"
                    onExtraSuccessAction={() => {
                      queryData.refetch();
                      close();
                    }}
                    btnLabel="Cập nhật"
                  />
                )}
              </ModalBuilder>
            )}
            {isDraft && (
              <CTAButton
                extraOnSuccess={() => {
                  router.push(NKRouter.importRequest.list());
                }}
                ctaApi={() => {
                  return importRequestApi.v1Delete(queryData?.data?.id || '');
                }}
                isConfirm
                confirmMessage="Bạn có xoá yêu cầu này?"
              >
                <Button type="primary" danger icon={<CloseOutlined rev="" />}>
                  Xoá Yêu Cầu
                </Button>
              </CTAButton>
            )}
            {isApproved && (
              <>
                <ModalBuilder
                  btnLabel="Tạo phiếu xuất kho"
                  modalTitle={``}
                  btnProps={{
                    size: 'middle',
                    type: 'default',
                    icon: <PlusOutlined rev="" />,
                  }}
                >
                  {(close) => <CreateForm importRequest={queryData.data} close={close} />}
                </ModalBuilder>
                <CTAButton
                  extraOnSuccess={() => {
                    queryData.refetch();
                  }}
                  ctaApi={() => {
                    return importRequestApi.v1ChangeComplete(queryData?.data?.id || '');
                  }}
                  isConfirm
                  confirmMessage="Bạn có muốn hoàn thành yêu cầu này?"
                >
                  <Button type="primary" icon={<CheckOutlined rev="" />}>
                    Hoàn Thành Yêu Cầu
                  </Button>
                </CTAButton>
              </>
            )}
          </div>
        }
        title="Chi tiết yêu cầu đặt thiết bị"
      />

      <Tabs
        tabBarStyle={{
          marginBottom: 0,
        }}
        defaultActiveKey="plan"
        items={[
          {
            label: 'Chi tiết yêu cầu',
            key: 'plan',
            children: (
              <>
                <div className="flex flex-col px-2 py-2 bg-white rounded-lg fade-in">
                  <div className="flex items-center justify-end gap-4 mb-2">
                    {!isSelect && (
                      <>
                        <CTAExportXLSXTable
                          removeColumns={['Ảnh']}
                          fileName={`yeu-cau-nhap-kho-${nkMoment().format('YYYY-MM-DD')}`}
                          tableId="import-plan"
                        >
                          <Button size="small" icon={<ExportOutlined rev="" />}>
                            Xuất Excel
                          </Button>
                        </CTAExportXLSXTable>
                        {isRequesting && (
                          <ModalBuilder
                            btnLabel="Thêm sản phẩm"
                            modalTitle={`Thêm sản phẩm`}
                            btnProps={{
                              size: 'small',
                              type: 'primary',
                              icon: <PlusOutlined rev="" />,
                            }}
                          >
                            {(close) => {
                              return (
                                <ImportRequestAddItem
                                  id={queryData.data?.id || ''}
                                  close={close}
                                  refetch={() => {
                                    queryData.refetch();
                                  }}
                                />
                              );
                            }}
                          </ModalBuilder>
                        )}
                      </>
                    )}
                    {isSelect && (
                      <>
                        <CTAButton
                          extraOnSuccess={() => {
                            queryData.refetch();
                          }}
                          ctaApi={async () => {
                            await Promise.all(
                              selectedRowGroup.map((item) => {
                                return importRequestApi.v1DeleteItem(queryData?.data?.id || '', item.id);
                              }),
                            );

                            setSelectedRowGroup([]);
                          }}
                          isConfirm
                          confirmMessage="Bạn có chắc chắn muốn xoá các sản phẩm này?"
                        >
                          <Button size="small" type="primary" danger icon={<DeleteOutlined rev="" />}></Button>
                        </CTAButton>
                      </>
                    )}
                  </div>
                  <Table
                    dataSource={queryData.data?.importRequestItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                    className="fade-in"
                    id="import-plan"
                    rowKey="id"
                    size="small"
                    summary={() => {
                      const totalQuantity =
                        queryData.data?.importRequestItems.reduce((acc, item) => {
                          return acc + item.quantity;
                        }, 0) || 0;

                      const totalQuantityApprove =
                        queryData.data?.importRequestItems.reduce((acc, item) => {
                          return acc + item.approveQuantity;
                        }, 0) || 0;

                      const totalQuantityExported =
                        queryData.data?.exportInventories
                          .filter((item) => item.status === 'APPROVED')
                          .map((item) => item.exportInventoryItems)
                          .flat()
                          .reduce((acc, item) => {
                            return acc + item.quantity;
                          }, 0) || 0;

                      const totalQuantityRemain = totalQuantity - totalQuantityExported;
                      return (
                        <Table.Summary.Row className="font-bold">
                          {isRequesting && <Table.Summary.Cell index={0}></Table.Summary.Cell>}
                          <Table.Summary.Cell index={0} className="font-bold">
                            Tổng
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}></Table.Summary.Cell>
                          <Table.Summary.Cell index={2}></Table.Summary.Cell>
                          <Table.Summary.Cell index={3}></Table.Summary.Cell>
                          <Table.Summary.Cell index={4}></Table.Summary.Cell>
                          <Table.Summary.Cell index={5} className="font-bold"></Table.Summary.Cell>
                          <Table.Summary.Cell index={6} className="font-bold">
                            {totalQuantity}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={7} className="font-bold">
                            {totalQuantityApprove}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={8} className="font-bold">
                            {totalQuantityExported}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={9} className="font-bold">
                            {totalQuantityRemain}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={10}></Table.Summary.Cell>
                        </Table.Summary.Row>
                      );
                    }}
                    rowSelection={
                      isRequesting
                        ? {
                            type: 'checkbox',
                            onChange(selectedRowKeys, selectedRows, info) {
                              setSelectedRowGroup(selectedRows);
                            },
                          }
                        : undefined
                    }
                    columns={[
                      {
                        key: 'imageUrls',
                        title: 'Ảnh',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'equipment.imageUrls') || _get(record, 'supply.imageUrls') || [];
                          return <FiledFirstImages value={value} />;
                        },
                      },
                      {
                        key: 'code',
                        title: 'Mã thiết bị',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'equipment.code') || _get(record, 'supply.code') || '';
                          return <FieldText value={value} />;
                        },
                      },
                      {
                        key: 'name',
                        title: 'Tên thiết bị',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'equipment.name') || _get(record, 'supply.name') || '';
                          return <FieldText value={value} />;
                        },
                      },

                      {
                        key: 'category',
                        title: 'Danh mục thiết bị',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'equipment.equipmentCategory.name') || _get(record, 'supply.supplyCategory.name') || '';
                          return <FieldText value={value} />;
                        },
                      },
                      {
                        key: 'brand',
                        title: 'Hãng',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'equipment.brand.name') || _get(record, 'supply.brand.name') || '';
                          return <FieldText value={value} />;
                        },
                      },

                      {
                        key: 'supply.quantity',
                        title: 'SL trong kho',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'supply.quantity', 0);
                          return <FieldNumber value={value.toString()} />;
                        },
                      },
                      {
                        key: 'quantity',
                        title: 'SL yêu cầu',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'quantity');
                          return <FieldNumber value={value.toString()} />;
                        },
                      },

                      {
                        key: 'quantity',
                        title: 'SL duyệt',
                        render: (record: ImportRequestItem) => {
                          const value = _get(record, 'approveQuantity');
                          return (
                            <input
                              type="number"
                              className="w-24 px-2 py-1 border border-gray-200 border-solid bg-none"
                              min={0}
                              disabled={!userStoreState.isFacilityManager || !isRequesting}
                              max={record.quantity}
                              defaultValue={value}
                              onChange={(e) => {
                                console.log(e.target.value);

                                const isNumber = joi.number().validate(e.target.value).error === undefined;

                                if (!isNumber) {
                                  toast.error(`Số lượng duyệt phải là số`);
                                  e.target.value = '';
                                  return;
                                }

                                const value = parseInt(e.target.value);

                                if (value < 0) {
                                  toast.error(`Số lượng duyệt không được nhỏ hơn 0`);
                                  e.target.value = '';
                                  return;
                                }

                                if (value > _get(record, 'supply.quantity', 0)) {
                                  toast.error(` số lượng duyệt không được lớn hơn số lượng trong kho`);
                                  e.target.value = _get(record, 'supply.quantity', 0).toString();
                                  return;
                                }

                                if (value > record.quantity) {
                                  toast.error(` số lượng duyệt không được lớn hơn số lượng yêu cầu`);
                                  e.target.value = record.quantity.toString();
                                  return;
                                }

                                importRequestApi
                                  .v1ChangeApproveQuantity(record?.id, {
                                    approveQuantity: parseInt(e.target.value),
                                  })
                                  .then(() => {
                                    queryData.refetch();
                                  });
                              }}
                            />
                          );
                        },
                      },
                      {
                        key: 'status',
                        title: 'SL đã xuất',
                        render: (record: ImportRequestItem) => {
                          const exportedQuantity =
                            queryData.data?.exportInventories
                              .filter((item) => item.id !== queryData.data?.id)
                              .filter((item) => item.status === 'APPROVED')
                              .map((item) => item.exportInventoryItems)
                              .flat()
                              .filter((item) => item.supply.id === record.supply.id)
                              .reduce((acc, item) => acc + item.quantity, 0) || 0;
                          return <FieldNumber value={exportedQuantity.toString()} />;
                        },
                      },
                      {
                        key: 'status',
                        title: 'SL còn lại',
                        render: (record: ImportRequestItem) => {
                          const requestQuantity = _get(record, 'quantity');
                          const exportedQuantity =
                            queryData.data?.exportInventories
                              .filter((item) => item.id !== queryData.data?.id)
                              .filter((item) => item.status === 'APPROVED')
                              .map((item) => item.exportInventoryItems)
                              .flat()
                              .filter((item) => item.supply.id === record.supply.id)
                              .reduce((acc, item) => acc + item.quantity, 0) || 0;

                          return <FieldNumber value={(requestQuantity - exportedQuantity).toString()} />;
                        },
                      },
                      {
                        key: 'id',
                        title: '',
                        width: 50,
                        render: (record: ImportRequestItem) => {
                          return (
                            <div className="flex gap-2">
                              {!isSelect && isRequesting && (
                                <>
                                  <CTAButton
                                    extraOnSuccess={() => {
                                      queryData.refetch();
                                    }}
                                    ctaApi={() => {
                                      return importRequestApi.v1DeleteItem(queryData?.data?.id || '', record.id);
                                    }}
                                    isConfirm
                                    confirmMessage="Bạn có chắc chắn muốn xoá sản phẩm này?"
                                  >
                                    <Button size="small" type="primary" danger icon={<DeleteOutlined rev="" />}></Button>
                                  </CTAButton>

                                  <ModalBuilder
                                    btnLabel=""
                                    modalTitle={`Cập Nhật sản phẩm`}
                                    btnProps={{
                                      size: 'small',
                                      icon: <EditOutlined rev="" />,
                                    }}
                                  >
                                    {(close) => {
                                      return (
                                        <ImportRequestUpdateItem
                                          id={queryData.data?.id || ''}
                                          item={record}
                                          close={close}
                                          refetch={() => {
                                            queryData.refetch();
                                          }}
                                        />
                                      );
                                    }}
                                  </ModalBuilder>
                                </>
                              )}
                            </div>
                          );
                        },
                      },
                    ]}
                    pagination={false}
                  />
                </div>
              </>
            ),
          },
          {
            label: 'Danh sách xuất kho',
            key: 'import',
            children: (
              <>
                <Table
                  dataSource={queryData.data?.exportInventories
                    .filter((item) => !item.isDeleted)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                  className="fade-in"
                  id="import-plan"
                  rowKey="id"
                  size="small"
                  columns={[
                    {
                      key: 'code',
                      title: 'Mã',
                      render: (record: ImportPlanItem) => {
                        const value = _get(record, 'code');
                        return <FieldText value={value} />;
                      },
                    },

                    {
                      key: 'exportDate',
                      title: 'Ngày xuất kho',
                      render: (record: ImportPlanItem) => {
                        const value = _get(record, 'exportDate');
                        return <FieldDisplay value={value} type={FieldType.TIME_DATE} />;
                      },
                    },

                    {
                      key: 'status',
                      title: 'Trạng thái',
                      render: (record: ImportPlanItem) => {
                        const value = _get(record, 'status');
                        return <FieldDisplay value={value} apiAction={exportInventoryApi.v1GetEnumStatus} type={FieldType.BADGE_API} />;
                      },
                    },
                    {
                      key: 'id',
                      title: '',
                      width: 50,
                      render: (record: ImportPlanItem) => {
                        return (
                          <>
                            <Link href={NKRouter.exportInventory.detail(record.id)}>
                              <Button size="small" type="primary" icon={<PaperClipOutlined rev="" />}>
                                Xem chi tiết
                              </Button>
                            </Link>
                          </>
                        );
                      },
                    },
                  ]}
                  pagination={false}
                />
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Page;
