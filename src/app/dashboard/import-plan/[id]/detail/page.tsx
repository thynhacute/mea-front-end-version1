'use client';

import * as React from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  PaperClipOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Table } from 'antd';
import { Tabs } from 'antd/lib';
import joi from 'joi';
import _get from 'lodash/get';
import { UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { NKConfig } from '@/core/NKConfig';
import { NKRouter } from '@/core/NKRouter';
import { equipmentApi } from '@/core/api/equipment.api';
import { ImportInventoryIV1CreateDto, importInventoryApi } from '@/core/api/import-inventory';
import {
  ImportPlanIV1UpdateDto,
  ImportPlanItemIV1CreateDto,
  ImportPlanItemIV1UpdateDto,
  UpdateStatusImportPlan,
  importPlanApi,
} from '@/core/api/import-plan.api';
import { supplyApi } from '@/core/api/supply.api';
import { xlsxApi } from '@/core/api/xlsx.api';
import CTAButton from '@/core/components/cta/CTABtn';
import CTAExportXLSXCustom from '@/core/components/cta/CTAExportXLSXCustom';
import CTAExportXLSXTable from '@/core/components/cta/CTAExportXLSXTable';
import CTAUploadXlsxAction from '@/core/components/cta/CTAUploadXlsxAction';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FieldMultipleText from '@/core/components/field/FieldMultipleText';
import FieldNumber from '@/core/components/field/FieldNumber';
import FieldText from '@/core/components/field/FieldText';
import FieldTime from '@/core/components/field/FieldTime';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { useBooleanWatcher } from '@/core/hooks/useBooleanWatcher';
import { EnumListItem } from '@/core/models/common';
import { Equipment } from '@/core/models/equipment';
import { ImportPlan } from '@/core/models/importPlan';
import { ImportPlanItem } from '@/core/models/importPlanItem';
import { Supply } from '@/core/models/supply';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { mapListToOptions } from '@/core/utils/api.helper';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const id = _get(params, 'id') as string;
  const [equipments, setEquipments] = React.useState<Equipment[]>([]);
  const [supplies, setSupplies] = React.useState<Supply[]>([]);
  const [formMethods, setFormMethods] = React.useState<UseFormReturn<any>>();
  const router = useRouter();

  const [selectedRowGroup, setSelectedRowGroup] = React.useState<ImportPlanItem[]>([]);

  const queryData = useQuery(
    ['import-plan', id],
    () => {
      return importPlanApi.v1GetById(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const { isAdmin, isInventoryManager } = useSelector<RootState, UserState>((state) => state.user);

  const isDraft = useBooleanWatcher(queryData.data?.status, 'DRAFT');
  const isSubmitted = useBooleanWatcher(queryData.data?.status, 'SUBMITTED');
  const isApproved = useBooleanWatcher(queryData.data?.status, 'APPROVED');
  const isSelect = selectedRowGroup.length > 0;

  if (queryData.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full gap-4 ">
      <FieldBuilder<ImportPlan>
        fields={[
          {
            key: 'name',
            label: 'Tên kế hoạch',
            type: FieldType.TEXT,
            span: 3,
          },
          {
            key: 'code',
            label: 'Mã',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            key: 'documentNumber',
            label: 'Số chứng từ',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            key: 'contractSymbol',
            label: 'Ký hiệu hoá đơn',
            type: FieldType.TEXT,
            span: 1,
          },
          {
            key: 'startImportDate',
            label: 'Ngày bắt đầu nhập kho',
            type: FieldType.TIME_FULL,
            span: 1,
          },
          {
            key: 'endImportDate',
            label: 'Ngày kết thúc nhập kho',
            type: FieldType.TIME_FULL,
            span: 1,
          },
          {
            key: 'status',
            label: 'Trạng thái',
            type: FieldType.BADGE_API,
            apiAction: importPlanApi.v1GetEnumStatus,
            span: 1,
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
            label: 'Ghi Chú',
            key: 'note',
            type: FieldType.MULTILINE_TEXT,
            span: 3,
          },
        ]}
        record={queryData.data}
        extra={
          <div className="flex items-center gap-4">
            {isSubmitted && isAdmin && (
              <>
                <ModalBuilder
                  btnLabel=" Duyệt Yêu Cầu"
                  modalTitle={` Duyệt Yêu Cầu`}
                  btnProps={{
                    type: 'primary',
                    icon: <CheckOutlined rev="" />,
                  }}
                >
                  <FormBuilder<UpdateStatusImportPlan>
                    apiAction={async (dto) => {
                      return importPlanApi.v1UpdateApprove(queryData?.data?.id || '', dto);
                    }}
                    onExtraSuccessAction={() => {
                      queryData.refetch();
                    }}
                    btnLabel="Xác nhận"
                    fields={[
                      {
                        label: 'Mô tả',
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

                <ModalBuilder
                  btnLabel="Từ Chối"
                  modalTitle={`Từ Chối Yêu Cầu`}
                  btnProps={{
                    type: 'primary',
                    danger: true,
                    icon: <CloseOutlined rev="" />,
                  }}
                >
                  <FormBuilder<UpdateStatusImportPlan>
                    apiAction={async (dto) => {
                      return importPlanApi.v1UpdateCancel(queryData?.data?.id || '', dto);
                    }}
                    onExtraSuccessAction={() => {
                      queryData.refetch();
                    }}
                    btnLabel="Xác nhận"
                    fields={[
                      {
                        label: 'Mô tả',
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
              <CTAButton
                extraOnSuccess={() => {
                  queryData.refetch();
                }}
                ctaApi={() => {
                  return importPlanApi.v1UpdateSubmit(queryData?.data?.id || '');
                }}
                isConfirm
                confirmMessage="Bạn có muốn gửi yêu cầu này?"
              >
                <Button type="primary" icon={<PaperClipOutlined rev="" />}>
                  Gửi Yêu Cầu
                </Button>
              </CTAButton>
            )}

            {isDraft && (
              <ModalBuilder
                btnLabel="Chỉnh sửa"
                modalTitle={`Cập nhật kế hoạch mua sắm`}
                btnProps={{
                  size: 'middle',
                  type: 'default',
                }}
              >
                {(close) => (
                  <FormBuilder<ImportPlanIV1UpdateDto>
                    apiAction={(dto) => {
                      return importPlanApi.v1Update(id, dto);
                    }}
                    schema={{
                      startImportDate: joi.any(),
                      endImportDate: joi.any(),
                      name: joi.any(),
                    }}
                    fields={[
                      {
                        label: 'Tên',
                        name: 'name',
                        type: NKFormType.TEXT,
                        span: 3,
                      },
                      {
                        label: 'Ngày bắt đầu nhập kho',
                        name: 'startImportDate',
                        type: NKFormType.DATE,
                        span: 3,
                      },
                      {
                        label: 'Ngày kết thúc nhập kho',
                        name: 'endImportDate',
                        type: NKFormType.DATE,
                        span: 3,
                      },
                    ]}
                    defaultValues={{
                      startImportDate: queryData.data?.startImportDate || nkMoment().format('YYYY-MM-DD'),
                      endImportDate: queryData.data?.endImportDate || nkMoment().format('YYYY-MM-DD'),
                      name: queryData.data?.name || '',
                    }}
                    title=""
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
                  router.push(NKRouter.importPlan.list());
                }}
                ctaApi={() => {
                  return importPlanApi.v1Delete(queryData?.data?.id || '');
                }}
                isConfirm
                confirmMessage="Bạn có xoá yêu cầu này?"
              >
                <Button type="primary" danger icon={<CloseOutlined rev="" />}>
                  Xoá Yêu Cầu
                </Button>
              </CTAButton>
            )}

            {isInventoryManager && (
              <>
                {isApproved && (
                  <ModalBuilder
                    btnLabel="Tạo phiếu nhập kho"
                    modalTitle={``}
                    btnProps={{
                      size: 'middle',
                      type: 'default',
                      icon: <PlusOutlined rev="" />,
                    }}
                  >
                    {(close) => (
                      <FormBuilder<ImportInventoryIV1CreateDto>
                        apiAction={importInventoryApi.v1Create}
                        fields={[
                          {
                            label: 'Tên',
                            name: 'name',
                            type: NKFormType.TEXT,
                            span: 3,
                          },
                          {
                            label: 'Mô tả',
                            name: 'note',
                            type: NKFormType.TEXTAREA,
                            span: 3,
                          },
                        ]}
                        defaultValues={{
                          importDate: nkMoment().format('YYYY-MM-DD'),
                          importPlanId: queryData.data?.id || '',
                          name: '',
                          note: '',
                        }}
                        title="Tạo phiếu nhập kho"
                        onExtraSuccessAction={(data) => {
                          const id = _get(data, 'id');
                          router.push(NKRouter.importInventory.detail(id));
                          close();
                        }}
                        btnLabel="Tạo"
                      />
                    )}
                  </ModalBuilder>
                )}
                {isApproved && (
                  <CTAButton
                    extraOnSuccess={() => {
                      queryData.refetch();
                    }}
                    ctaApi={() => {
                      return importPlanApi.v1ChangeComplete(queryData?.data?.id || '');
                    }}
                    isConfirm
                    confirmMessage="Bạn có muốn hoàn thành yêu cầu này?"
                  >
                    <Button type="primary" icon={<CheckOutlined rev="" />}>
                      Hoàn Thành Yêu Cầu
                    </Button>
                  </CTAButton>
                )}
              </>
            )}
          </div>
        }
        title="Chi tiết kế hoạch mua sắm"
      />
      <Tabs
        tabBarStyle={{
          marginBottom: 0,
        }}
        defaultActiveKey="plan"
        items={[
          {
            label: 'Chi tiết kế hoạch',
            key: 'plan',
            children: (
              <>
                <div className="flex flex-col px-2 py-2 bg-white rounded-lg fade-in">
                  <div className="flex items-center justify-end gap-4 mb-2">
                    {!isSelect && (
                      <>
                        {isDraft && (
                          <ModalBuilder
                            btnProps={{
                              size: 'small',
                              icon: <ImportOutlined rev="" />,
                            }}
                            btnLabel="Thêm sản phẩm từ file"
                            modalTitle="Thêm sản phẩm từ file"
                          >
                            <div className="flex items-center gap-1 mb-2">
                              <div className="text-gray-400 ext-sm ">Vui lòng </div>
                              <a
                                href={`/assets/SAMPLE-PhieuKeHoachMuaSam.xlsx`}
                                className="block text-blue-500 underline"
                                download="SAMPLE-PhieuKeHoachMuaSam.xlsx"
                              >
                                Tải file mẫu
                              </a>
                            </div>
                            <CTAUploadXlsxAction
                              onExtraSuccessAction={(data) => {
                                queryData.refetch();
                                // const isIncorrectData = _get(data, 'isIncorrectData', false);
                                // console.log(data);
                                // if (isIncorrectData) {
                                //   const link = NKConfig.API_URL + _get(data, 'path', '');
                                //   toast.warn(
                                //     <div>
                                //       <div className="text-sm">Một số sản phẩm không được thêm vào kế hoạch mua sắm do dữ liệu không hợp lệ.</div>
                                //       <a className="mt-1 text-blue-500 underline" href={link} target="_blank" rel="noopener noreferrer">
                                //         Tải file lỗi
                                //       </a>
                                //     </div>,
                                //     {
                                //       autoClose: false,
                                //     },
                                //   );
                                // } else {
                                //   toast.success('Thêm sản phẩm thành công');
                                // }
                              }}
                              apiAction={(file) => importPlanApi.v1UpdateUpload(queryData?.data?.id || '', file)}
                            />
                          </ModalBuilder>
                        )}
                        <CTAButton
                          ctaApi={async () => {
                            const filePath = await xlsxApi.v1Create(
                              queryData.data?.importPlanItems.map((item) => {
                                return {
                                  'Tên hàng': item.name,
                                  'Mã thiết bị': item.code,
                                  'Loại thiết bị': item.category,
                                  'Ngày sản xuất': '',
                                  'Hạn dùng': '',
                                  'Ngày bảo hành': '',
                                  'Mô tả': item.description,
                                  'Số lượng': item.quantity,
                                  'Đơn vị tính': item.unit,
                                  'Đơn giá': item.price,
                                };
                              }) || [],
                            );

                            console.log(filePath);

                            // download file
                            const link = NKConfig.API_URL + filePath;
                            window.open(link, '_blank');
                          }}
                        >
                          <Button size="small" icon={<ExportOutlined rev="" />}>
                            Xuất Excel dưới dạng phiếu nhập
                          </Button>
                        </CTAButton>
                        <CTAExportXLSXTable fileName={`ke-hoach-nhap-kho-${nkMoment().format('YYYY-MM-DD')}`} tableId="import-plan">
                          <Button size="small" icon={<ExportOutlined rev="" />}>
                            Xuất Excel
                          </Button>
                        </CTAExportXLSXTable>
                        {isDraft && (
                          <ModalBuilder
                            btnLabel="Thêm sản phẩm"
                            modalTitle={`Tạo sản phẩm`}
                            btnProps={{
                              size: 'small',
                              type: 'primary',
                              icon: <PlusOutlined rev="" />,
                            }}
                          >
                            {(close) => {
                              return (
                                <FormBuilder<ImportPlanItemIV1CreateDto>
                                  apiAction={(dto) => {
                                    return importPlanApi.v1CreateItem(queryData?.data?.id || '', dto);
                                  }}
                                  onExtraSuccessAction={() => {
                                    queryData.refetch();
                                    close();
                                  }}
                                  setFormMethods={(data) => setFormMethods(data)}
                                  btnLabel="Tạo"
                                  fields={[
                                    {
                                      label: 'Tên thiết bị',
                                      name: 'name',
                                      type: NKFormType.AUTO_COMPLETE,
                                      span: 1,
                                      useAction: async (value) => {
                                        const equipments = await equipmentApi.v1Select(value);
                                        setEquipments(equipments);
                                        const supplies = await supplyApi.v1Select(value);

                                        setSupplies(supplies);
                                        return [...mapListToOptions(supplies)];
                                      },
                                      fieldProps: {
                                        extraSelectAction: (value: EnumListItem) => {
                                          const id = _get(value, 'id');

                                          if (id) {
                                            const equipment = equipments.find((item) => item.id === id);
                                            const supply = supplies.find((item) => item.id === id);

                                            if (equipment) {
                                              formMethods?.setValue('code', equipment.code);
                                              formMethods?.setValue('brand', equipment.brand?.name);
                                              formMethods?.setValue('unit', 'Cái');
                                              formMethods?.setValue('category', equipment.equipmentCategory?.name);
                                              formMethods?.setValue('description', equipment.description || '');
                                              formMethods?.setValue('machine', equipment.equipmentCategory?.code || '');
                                            }

                                            if (supply) {
                                              formMethods?.setValue('code', supply.code);
                                              formMethods?.setValue('brand', supply.brand?.name);
                                              formMethods?.setValue('unit', supply.unit);
                                              formMethods?.setValue('category', supply.supplyCategory?.name);
                                              formMethods?.setValue('description', supply.description || '');
                                              formMethods?.setValue('machine', '');
                                            }
                                          }
                                        },
                                      },
                                    },
                                    {
                                      label: 'Mã thiết bị',
                                      name: 'code',
                                      type: NKFormType.TEXT,
                                      fieldProps: {
                                        disabled: true,
                                      },
                                      span: 1,
                                    },
                                    {
                                      label: 'Kiểu Máy',
                                      name: 'machine',
                                      type: NKFormType.TEXT,
                                      span: 1,
                                    },
                                    {
                                      label: 'Loại thiết bị',
                                      name: 'category',
                                      type: NKFormType.TEXT,
                                      span: 1,
                                    },
                                    {
                                      label: 'Hãng',
                                      name: 'brand',
                                      type: NKFormType.TEXT,
                                      span: 1,
                                    },
                                    {
                                      label: 'Đơn vị tính',
                                      name: 'unit',
                                      type: NKFormType.TEXT,
                                      span: 1,
                                    },
                                    {
                                      label: 'Đơn giá',
                                      name: 'price',
                                      type: NKFormType.NUMBER,
                                      span: 1,
                                    },
                                    {
                                      label: 'SL kế hoạch',
                                      name: 'quantity',
                                      type: NKFormType.NUMBER,
                                      span: 1,
                                    },

                                    {
                                      label: 'Thông Tin Liên Hệ',
                                      name: 'contact',
                                      type: NKFormType.TEXT,
                                      span: 1,
                                    },
                                    {
                                      label: 'Mô tả',
                                      name: 'description',
                                      type: NKFormType.TEXTAREA,
                                      span: 3,
                                    },
                                  ]}
                                  title=""
                                  defaultValues={{
                                    brand: '',
                                    category: '',
                                    code: '',
                                    contact: '',
                                    description: '',
                                    machine: '',
                                    name: '',
                                    price: 0,
                                    quantity: 1,

                                    unit: '',
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
                                return importPlanApi.v1DeleteItem(queryData?.data?.id || '', item.id);
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
                    dataSource={queryData.data?.importPlanItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                    className="fade-in"
                    id="import-plan"
                    rowKey="id"
                    size="small"
                    summary={(data) => {
                      const importPlanQuantity = data
                        .map((item) => item.quantity)
                        .reduce((a, b) => a + b, 0)
                        .toString();
                      const importInventoryQuantity = (queryData.data?.importInventories || [])
                        ?.filter((item) => item.status === 'APPROVED')
                        .map((item) => item.importInventoryItems)
                        .flat()
                        .reduce((a, b) => a + (b?.quantity || 0), 0)
                        .toString();
                      const remainQuantity = parseInt(importPlanQuantity) - parseInt(importInventoryQuantity);

                      const totalPrices = data
                        .map((item) => item.price * item.quantity)
                        .reduce((a, b) => a + b, 0)
                        .toString();

                      return (
                        <>
                          <Table.Summary.Row className="font-bold">
                            {isDraft && <Table.Summary.Cell index={1}></Table.Summary.Cell>}
                            <Table.Summary.Cell index={0} className="font-bold">
                              Tổng
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}></Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5} className="font-bold"></Table.Summary.Cell>
                            <Table.Summary.Cell index={6} className="font-bold">
                              {importPlanQuantity}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={7} className="font-bold">
                              {importInventoryQuantity}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={8} className="font-bold">
                              {remainQuantity}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={9} className="font-bold"></Table.Summary.Cell>
                            <Table.Summary.Cell index={9} className="font-bold"></Table.Summary.Cell>
                            <Table.Summary.Cell index={10}>
                              <FieldNumber value={totalPrices} />
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </>
                      );
                    }}
                    rowSelection={
                      isDraft
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
                        key: 'code',
                        title: 'Mã thiết bị',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'code');
                          return <FieldText value={value} />;
                        },
                      },
                      {
                        key: 'name',
                        title: 'Tên thiết bị',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'name');
                          return <FieldText value={value} />;
                        },
                      },

                      {
                        key: 'machine',
                        title: 'Kiểu Máy',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'machine');
                          return <FieldText value={value} />;
                        },
                      },
                      {
                        key: 'category',
                        title: 'Loại thiết bị',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'category');
                          return <FieldText value={value} />;
                        },
                      },
                      {
                        key: 'brand',
                        title: 'Hãng',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'brand');
                          return <FieldText value={value} />;
                        },
                      },
                      {
                        key: 'description',
                        title: 'Mô tả',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'description');
                          return <FieldMultipleText value={value} />;
                        },
                      },
                      {
                        key: 'quantity',
                        title: 'SL kế hoạch',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'quantity');
                          return <FieldNumber value={value.toString()} />;
                        },
                      },
                      {
                        key: 'quantityImported',
                        title: 'SL đã nhập',
                        render: (record: ImportPlanItem) => {
                          const importInventoryItems = (queryData.data?.importInventories || [])
                            ?.filter((item) => item.status === 'APPROVED')
                            .map((item) => item.importInventoryItems)
                            .flat()
                            .filter((item) => item.supply.code === record.code)
                            .reduce((a, b) => a + (b?.quantity || 0), 0);

                          return <FieldNumber value={importInventoryItems?.toString() || '0'} />;
                        },
                      },
                      {
                        key: 'quantityRemain',
                        title: 'SL còn lại',
                        render: (record: ImportPlanItem) => {
                          const importInventoryItems = (queryData.data?.importInventories || [])
                            ?.filter((item) => item.status === 'APPROVED')
                            .map((item) => item.importInventoryItems)
                            .flat()
                            .filter((item) => item.supply.code === record.code)
                            .reduce((a, b) => a + (b?.quantity || 0), 0);
                          const value = _get(record, 'quantity') - importInventoryItems;
                          return <FieldNumber value={value.toString()} />;
                        },
                      },
                      {
                        key: 'unit',
                        title: 'Đơn vị tính',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'unit');
                          return <FieldText value={value} />;
                        },
                      },

                      {
                        key: 'price',
                        title: 'Đơn giá',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'price');
                          return <FieldNumber value={value.toString()} />;
                        },
                      },
                      {
                        key: 'total',
                        title: 'Thành Tiền',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'price') * _get(record, 'quantity');
                          return <FieldNumber value={value.toString()} />;
                        },
                      },
                      {
                        key: 'contact',
                        title: 'Thông Tin Liên Hệ',
                        render: (record: ImportPlanItem) => {
                          const value = _get(record, 'contact');
                          return <FieldText value={value} />;
                        },
                      },

                      {
                        key: 'id',
                        title: '',
                        width: 50,
                        render: (record: ImportPlanItem) => {
                          return (
                            <div className="flex gap-2">
                              {!isSelect && isDraft && (
                                <>
                                  <CTAButton
                                    extraOnSuccess={() => {
                                      queryData.refetch();
                                    }}
                                    ctaApi={() => {
                                      return importPlanApi.v1DeleteItem(queryData?.data?.id || '', record.id);
                                    }}
                                    isConfirm
                                    confirmMessage="Bạn có chắc chắn muốn xoá sản phẩm này?"
                                  >
                                    <Button size="small" type="primary" danger icon={<DeleteOutlined rev="" />}></Button>
                                  </CTAButton>
                                  <ModalBuilder
                                    btnLabel=""
                                    modalTitle={`Chỉnh sửa sản phẩm`}
                                    btnProps={{
                                      size: 'small',
                                      icon: <EditOutlined rev="" />,
                                    }}
                                  >
                                    <FormBuilder<ImportPlanItemIV1UpdateDto>
                                      apiAction={(dto) => {
                                        return importPlanApi.v1UpdateItem(queryData?.data?.id || '', record.id, dto);
                                      }}
                                      btnLabel="Cập nhật"
                                      onExtraSuccessAction={() => {
                                        queryData.refetch();
                                      }}
                                      setFormMethods={(data) => setFormMethods(data)}
                                      fields={[
                                        {
                                          label: 'Tên thiết bị',
                                          name: 'name',
                                          type: NKFormType.AUTO_COMPLETE,
                                          span: 1,
                                          useAction: async (value) => {
                                            const equipments = await equipmentApi.v1Select(value);
                                            setEquipments(equipments);
                                            const supplies = await supplyApi.v1Select(value);
                                            setSupplies(supplies);
                                            return [...mapListToOptions(equipments), ...mapListToOptions(supplies)];
                                          },
                                          fieldProps: {
                                            extraSelectAction: (value: EnumListItem) => {
                                              const id = _get(value, 'id');

                                              if (id) {
                                                const equipment = equipments.find((item) => item.id === id);
                                                const supply = supplies.find((item) => item.id === id);

                                                if (equipment) {
                                                  formMethods?.setValue('code', equipment.code);
                                                  formMethods?.setValue('brand', equipment.brand?.name);
                                                  formMethods?.setValue('unit', 'Cái');
                                                  formMethods?.setValue('category', equipment.equipmentCategory?.name);
                                                  formMethods?.setValue('description', equipment.description || '');
                                                  formMethods?.setValue('machine', equipment.equipmentCategory?.code || '');
                                                }

                                                if (supply) {
                                                  formMethods?.setValue('code', supply.code);
                                                  formMethods?.setValue('brand', supply.brand?.name);
                                                  formMethods?.setValue('unit', supply.unit);
                                                  formMethods?.setValue('category', supply.supplyCategory?.name);
                                                  formMethods?.setValue('description', supply.description || '');
                                                  formMethods?.setValue('machine', '');
                                                }
                                              }
                                            },
                                          },
                                        },
                                        {
                                          label: 'Mã thiết bị',
                                          name: 'code',
                                          type: NKFormType.TEXT,
                                          span: 1,
                                        },
                                        {
                                          label: 'Kiểu Máy',
                                          name: 'machine',
                                          type: NKFormType.TEXT,
                                          span: 1,
                                        },
                                        {
                                          label: 'Loại thiết bị',
                                          name: 'category',
                                          type: NKFormType.TEXT,
                                          span: 1,
                                        },
                                        {
                                          label: 'Hãng',
                                          name: 'brand',
                                          type: NKFormType.TEXT,
                                          span: 1,
                                        },
                                        {
                                          label: 'Đơn vị tính',
                                          name: 'unit',
                                          type: NKFormType.TEXT,
                                          span: 1,
                                        },
                                        {
                                          label: 'Đơn giá',
                                          name: 'price',
                                          type: NKFormType.NUMBER,
                                          span: 1,
                                        },
                                        {
                                          label: 'SL kế hoạch',
                                          name: 'quantity',
                                          type: NKFormType.NUMBER,
                                          span: 1,
                                        },

                                        {
                                          label: 'Thông Tin Liên Hệ',
                                          name: 'contact',
                                          type: NKFormType.TEXT,
                                          span: 1,
                                        },
                                        {
                                          label: 'Mô tả',
                                          name: 'description',
                                          type: NKFormType.TEXTAREA,
                                          span: 3,
                                        },
                                      ]}
                                      title=""
                                      defaultValues={{
                                        brand: record.brand || '',
                                        category: record.category || '',
                                        code: record.code || '',
                                        contact: record.contact || '',
                                        description: record.description || '',
                                        machine: record.machine || '',
                                        name: record.name || '',
                                        price: record.price || 0,
                                        quantity: record.quantity || 0,

                                        unit: record.unit || '',
                                      }}
                                    />
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
            label: 'Danh sách nhập kho',
            key: 'import',
            children: (
              <>
                <Table
                  dataSource={queryData.data?.importInventories
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
                      key: 'name',
                      title: 'Tên phiếu nhập',
                      render: (record: ImportPlanItem) => {
                        const value = _get(record, 'name');
                        return <FieldText value={value} />;
                      },
                    },
                    {
                      key: 'importDate',
                      title: 'Ngày nhập',
                      render: (record: ImportPlanItem) => {
                        const value = _get(record, 'importDate');
                        return <FieldDisplay value={value} type={FieldType.TIME_DATE} />;
                      },
                    },

                    {
                      key: 'status',
                      title: 'Trạng thái',
                      render: (record: ImportPlanItem) => {
                        const value = _get(record, 'status');
                        return <FieldDisplay value={value} apiAction={importInventoryApi.v1GetEnumStatus} type={FieldType.BADGE_API} />;
                      },
                    },
                    {
                      key: 'id',
                      title: '',
                      width: 50,
                      render: (record: ImportPlanItem) => {
                        return (
                          <>
                            <Link href={NKRouter.importInventory.detail(record.id)}>
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
