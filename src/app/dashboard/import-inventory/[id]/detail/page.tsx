'use client';

import * as React from 'react';

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
import axios from 'axios';
import _get from 'lodash/get';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';

import { NKConfig } from '@/core/NKConfig';
import { NKConstant } from '@/core/NKConstant';
import { NKRouter } from '@/core/NKRouter';
import { brandApi } from '@/core/api/brand.api';
import { equipmentCategoryApi } from '@/core/api/equipment-category.api';
import { equipmentApi } from '@/core/api/equipment.api';
import {
  ImportInventoryIV1UpdateDto,
  ImportInventoryItemIV1ApproveDto,
  ImportInventoryItemIV1CancelDto,
  ImportInventoryItemIV1CreateDto,
  ImportInventoryItemIV1CreateEquipmentDto,
  ImportInventoryItemIV1UpdateDto,
  importInventoryApi,
} from '@/core/api/import-inventory';
import { importPlanApi } from '@/core/api/import-plan.api';
import { supplyApi } from '@/core/api/supply.api';
import CTAButton from '@/core/components/cta/CTABtn';
import CTAExportXLSXTable from '@/core/components/cta/CTAExportXLSXTable';
import CTAUploadXlsxAction from '@/core/components/cta/CTAUploadXlsxAction';
import FieldBuilder from '@/core/components/field/FieldBuilder';
import FieldDisplay, { FieldType } from '@/core/components/field/FieldDisplay';
import FieldMultipleText from '@/core/components/field/FieldMultipleText';
import FieldNumber from '@/core/components/field/FieldNumber';
import FieldText from '@/core/components/field/FieldText';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import { useBooleanWatcher } from '@/core/hooks/useBooleanWatcher';
import { Equipment } from '@/core/models/equipment';
import { ImportInventory } from '@/core/models/importInventory';
import { ImportInventoryItem } from '@/core/models/importInventoryItem';
import { Supply } from '@/core/models/supply';
import { nkMoment } from '@/core/utils/moment';

interface PageProps {}

const Page: React.FunctionComponent<PageProps> = () => {
  const params = useParams();
  const id = _get(params, 'id') as string;
  const [equipmentId, setEquipmentId] = React.useState<string>('');
  const [equipments, setEquipments] = React.useState<Equipment[]>([]);
  const [supplies, setSupplies] = React.useState<Supply[]>([]);
  const [formMethods, setFormMethods] = React.useState<UseFormReturn<any, any, undefined>>();
  const [importPlanId, setImportPlanId] = React.useState<string>('');
  const router = useRouter();

  const [selectedRowGroup, setSelectedRowGroup] = React.useState<ImportInventoryItem[]>([]);

  const queryData = useQuery(
    ['import-inventory', id],
    () => {
      return importInventoryApi.v1GetById(id);
    },
    {
      onSuccess: (data) => {
        setImportPlanId(data?.importPlan?.id || '');
      },
    },
  );

  const importPlanQuery = useQuery(
    ['import-plan', importPlanId],
    () => {
      return importPlanApi.v1GetById(importPlanId);
    },
    {
      enabled: Boolean(importPlanId),
    },
  );

  const isDraft = useBooleanWatcher(queryData.data?.status, 'DRAFT');
  const isRequesting = useBooleanWatcher(queryData.data?.status, 'REQUESTING');
  const isApproved = useBooleanWatcher(queryData.data?.status, 'APPROVED');
  const isCancelled = useBooleanWatcher(queryData.data?.status, 'CANCELLED');
  const isSelect = selectedRowGroup.length > 0;

  const allSupplies = useQuery(
    ['supplies'],
    () => {
      return supplyApi.v1GetAll();
    },
    {
      initialData: [],
    },
  );

  if (queryData.isLoading) {
    return <div>Loading...</div>;
  }

  async function deleteEquipment(id: string) {
    const cookies = new Cookies();
    const token = cookies.get(NKConstant.TOKEN_COOKIE_KEY);
    if (id) {
      await axios.delete(`${NKConfig.API_URL}/v1/equipment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEquipmentId('');
    }
  }

  return (
    <div className="flex flex-col w-full gap-4 ">
      <FieldBuilder<ImportInventory>
        fields={[
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
            apiAction: importInventoryApi.v1GetEnumStatus,
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
          ...(queryData.data?.importPlan
            ? ([
                {
                  key: 'importPlan',
                  label: 'Kế hoạch mua sắm',
                  type: FieldType.LINK,
                  span: 1,
                  apiAction: async (value: any) => {
                    return {
                      link: NKRouter.importPlan.detail(value.id),
                      label: value.code,
                    };
                  },
                },
                {
                  key: 'importPlan.documentNumber',
                  label: 'Số chứng từ',
                  type: FieldType.TEXT,
                  span: 1,
                },
                {
                  key: 'importPlan.contractSymbol',
                  label: 'Ký hiệu hoá đơn',
                  type: FieldType.TEXT,
                  span: 1,
                },
              ] as any)
            : []),
          {
            label: 'Mô tả',
            key: 'note',
            type: FieldType.MULTILINE_TEXT,
            span: 2,
          },
        ]}
        record={queryData.data}
        extra={
          <div className="flex items-center gap-4">
            {isRequesting && (
              <>
                <ModalBuilder
                  modalTitle="Duyệt Yêu Cầu"
                  btnLabel="Duyệt Yêu Cầu"
                  btnProps={{
                    icon: <CheckOutlined rev="" />,
                    type: 'primary',
                  }}
                >
                  <FormBuilder<ImportInventoryItemIV1ApproveDto>
                    apiAction={(dto) => {
                      return importInventoryApi.v1UpdateApprove(queryData?.data?.id || '', dto);
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
                <ModalBuilder
                  modalTitle="Từ Chối Yêu Cầu"
                  btnLabel="Từ Chối Yêu Cầu"
                  btnProps={{
                    icon: <CloseOutlined rev="" />,
                    type: 'primary',
                    danger: true,
                  }}
                >
                  <FormBuilder<ImportInventoryItemIV1CancelDto>
                    apiAction={(dto) => {
                      return importInventoryApi.v1UpdateCancel(queryData?.data?.id || '', dto);
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
            {isDraft && (
              <CTAButton
                extraOnSuccess={async () => {
                  await importInventoryApi.v1UpdateApprove(queryData?.data?.id || '', { note: 'ok' });
                  queryData.refetch();
                }}
                ctaApi={() => {
                  return importInventoryApi.v1UpdateSubmit(queryData?.data?.id || '');
                }}
                isConfirm
                confirmMessage="Bạn có muốn hoàn thành đơn này?"
              >
                <Button type="primary" icon={<PaperClipOutlined rev="" />}>
                  Hoàn Thành
                </Button>
              </CTAButton>
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
                  <FormBuilder<ImportInventoryIV1UpdateDto>
                    apiAction={(data) => importInventoryApi.v1Update(id, data)}
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
                      // {
                      //     label: 'Ngày nhập kho',
                      //     name: 'importDate',
                      //     type: NKFormType.DATE,
                      //     span: 3,
                      // },
                      // {
                      //   label: 'Kế hoạch mua sắm',
                      //   name: 'importPlanId',
                      //   type: NKFormType.SELECT_API_OPTION,
                      //   apiAction: async (data) => {
                      //     const res = await importPlanApi.v1GetSelect(data);

                      //     return addNoSelectOption(
                      //       mapListToOptions(
                      //         res.filter((item) => item.status === 'APPROVED'),
                      //         'code',
                      //       ),
                      //     );
                      //   },
                      //   span: 3,
                      // },
                    ]}
                    defaultValues={{
                      importDate: nkMoment(queryData.data?.importDate).format('YYYY-MM-DD') || nkMoment().format('YYYY-MM-DD'),
                      importPlanId: queryData.data?.importPlan?.id || '',
                      name: queryData.data?.name || '',
                      note: queryData.data?.note || '',
                    }}
                    title="Cập nhật phiếu nhập kho"
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
                  router.push(NKRouter.importInventory.list());
                }}
                ctaApi={() => {
                  return importInventoryApi.v1Delete(queryData?.data?.id || '');
                }}
                isConfirm
                confirmMessage="Bạn có xoá đơn này?"
              >
                <Button type="primary" danger icon={<CloseOutlined rev="" />}>
                  Xoá Đơn
                </Button>
              </CTAButton>
            )}
          </div>
        }
        title="Chi tiết phiếu nhập kho"
      />
      {Boolean(allSupplies.data.length) && (
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
                      btnLabel="Thêm hàng từ file"
                      modalTitle="Thêm hàng từ file"
                    >
                      <div className="flex items-center gap-1 mb-2">
                        <div className="text-gray-400 ext-sm ">Vui lòng </div>
                        <a href={`/assets/SAMPLE-PhieuNhapKho.xlsx`} className="block text-blue-500 underline" download="SAMPLE-PhieuNhapKho.xlsx">
                          Tải file mẫu
                        </a>
                      </div>
                      <CTAUploadXlsxAction
                        onExtraSuccessAction={(data) => {
                          queryData.refetch();
                        }}
                        apiAction={(file) => importInventoryApi.v1UpdateUpload(queryData?.data?.id || '', file)}
                      />
                    </ModalBuilder>
                  )}
                  <CTAExportXLSXTable fileName={`phieu-nhap-kho-${nkMoment().format('YYYY-MM-DD')}`} tableId="import-plan">
                    <Button size="small" icon={<ExportOutlined rev="" />}>
                      Xuất Excel
                    </Button>
                  </CTAExportXLSXTable>
                  {!Boolean(queryData.data?.importPlan) && (
                    <>
                      {isDraft && (
                        <ModalBuilder
                          btnLabel="Thêm Vật Tư"
                          modalTitle={`Thêm Vật Tư`}
                          btnProps={{
                            size: 'small',
                            type: 'primary',
                            icon: <PlusOutlined rev="" />,
                          }}
                        >
                          {(close) => (
                            <FormBuilder<ImportInventoryItemIV1CreateDto>
                              apiAction={(dto) => {
                                if (queryData.data?.importPlan) {
                                  const supply = allSupplies.data?.find((item) => item.id === dto.supplyId);
                                  const importPlanItem = queryData.data.importPlan.importPlanItems.find((item) => item.code === supply?.code);
                                  const existItemQuantity =
                                    queryData.data.importInventoryItems
                                      .filter((item) => item.supply.code === supply?.code)
                                      .reduce((a, b) => a + b.quantity, 0) || 0;

                                  const importedInventoryQuantity = (
                                    importPlanQuery.data?.importInventories.filter((i) => i.status === 'APPROVED') || []
                                  )
                                    .map((subItem) => {
                                      return subItem.importInventoryItems.filter((i) => i.supply.code === supply?.code);
                                    })
                                    .flat()
                                    .reduce((a, b) => a + b.quantity, 0);

                                  if (importPlanItem) {
                                    if (importPlanItem.quantity < dto.quantity + existItemQuantity + importedInventoryQuantity) {
                                      toast.error('Số lượng nhập không được lớn hơn số lượng trong kế hoạch');
                                      return Promise.reject();
                                    }
                                    dto.price = importPlanItem.price;
                                  }
                                }

                                return importInventoryApi.v1CreateItem(queryData?.data?.id || '', {
                                  ...dto,
                                  endOfWarrantyDate: dto.expiredDate,
                                });
                              }}
                              onExtraSuccessAction={() => {
                                queryData.refetch();
                                close();
                              }}
                              btnLabel="Thêm"
                              fields={[
                                {
                                  label: 'Tên hàng ',
                                  name: 'supplyId',
                                  type: NKFormType.SELECT_API_OPTION,
                                  span: 3,
                                  useAction: async (value) => {
                                    let res = await supplyApi.v1Select(value);
                                    if (queryData.data?.importPlan) {
                                      const importPlanCode = queryData.data.importPlan.importPlanItems.map((item) => item.code);

                                      res = res.filter((item) => importPlanCode.includes(item.code));
                                    }

                                    return res;
                                  },
                                },
                                {
                                  label: 'Ngày sản xuất',
                                  name: 'mfDate',
                                  type: NKFormType.DATE,
                                  span: 3,
                                },
                                {
                                  label: 'Hạn dùng',
                                  name: 'expiredDate',
                                  type: NKFormType.DATE,
                                  span: 3,
                                },
                                ...(queryData.data?.importPlan
                                  ? []
                                  : ([
                                      {
                                        label: 'Đơn giá',
                                        name: 'price',
                                        type: NKFormType.NUMBER,
                                        span: 3,
                                      },
                                    ] as any)),
                                {
                                  label: 'Số lượng',
                                  name: 'quantity',
                                  type: NKFormType.NUMBER,
                                  span: 3,
                                },
                                // {
                                //   label: 'Mô tả',
                                //   name: 'note',
                                //   type: NKFormType.TEXTAREA,
                                //   span: 3,
                                // },
                              ]}
                              title=""
                              defaultValues={{
                                endOfWarrantyDate: nkMoment().format('YYYY-MM-DD'),
                                equipmentId: null,
                                expiredDate: nkMoment().format('YYYY-MM-DD'),
                                mfDate: nkMoment().format('YYYY-MM-DD'),
                                note: 'Nhập kho',
                                price: 0,
                                quantity: 1,
                                supplyId: '',
                              }}
                            />
                          )}
                        </ModalBuilder>
                      )}
                    </>
                  )}
                  {isDraft && !queryData.data?.importPlan && (
                    <ModalBuilder
                      btnLabel="Thêm Thiết Bị"
                      modalTitle={`Thêm Thiết Bị`}
                      btnProps={{
                        size: 'small',
                        type: 'primary',
                        icon: <PlusOutlined rev="" />,
                      }}
                    >
                      {(close) => (
                        <FormBuilder<ImportInventoryItemIV1CreateEquipmentDto>
                          apiAction={async (dto) => {
                            const equipment = await equipmentApi.v1Create({
                              brandId: dto.brandId,
                              code: dto.code,
                              description: '',
                              endOfWarrantyDate: dto.endOfWarrantyDate,
                              equipmentCategoryId: dto.equipmentCategoryId,
                              equipmentStatus: 'DRAFT',
                              imageUrls: [],
                              importDate: queryData.data?.importDate || '',
                              mfDate: dto.mfDate,
                              name: dto.name,
                            });

                            setEquipmentId(equipment.id);

                            return importInventoryApi.v1CreateItem(queryData?.data?.id || '', {
                              endOfWarrantyDate: dto.endOfWarrantyDate,
                              equipmentId: equipment.id,
                              expiredDate: dto.endOfWarrantyDate,
                              mfDate: dto.mfDate,
                              note: dto.note,
                              price: dto.price,
                              quantity: dto.quantity,
                              supplyId: null,
                            });
                          }}
                          onExtraSuccessAction={() => {
                            queryData.refetch();
                            close();
                          }}
                          onExtraErrorAction={async () => {
                            if (equipmentId) {
                              await deleteEquipment(equipmentId);
                            }
                          }}
                          btnLabel="Thêm"
                          fields={[
                            {
                              label: 'Tên Thiết Bị',
                              name: 'name',
                              type: NKFormType.AUTO_COMPLETE,
                              span: 3,
                              useAction: async (value) => await equipmentApi.v1Select(value),
                            },
                            {
                              label: 'Danh mục thiết bị',
                              name: 'equipmentCategoryId',
                              type: NKFormType.SELECT_API_OPTION,
                              span: 3,
                              useAction: async (value) => await equipmentCategoryApi.v1GetSelect(value),
                            },
                            {
                              label: 'Hãng',
                              name: 'brandId',
                              type: NKFormType.SELECT_API_OPTION,
                              span: 3,
                              useAction: async (value) => await brandApi.v1GetSelect(value),
                            },
                            {
                              label: 'Mã thiết bị',
                              name: 'code',
                              type: NKFormType.TEXT,
                              span: 3,
                            },
                            {
                              label: 'Ngày sản xuất',
                              name: 'mfDate',
                              type: NKFormType.DATE,
                              span: 2,
                            },
                            {
                              label: 'Hạn bảo hành',
                              name: 'endOfWarrantyDate',
                              type: NKFormType.DATE,
                              span: 1,
                            },
                            {
                              label: 'Đơn giá',
                              name: 'price',
                              type: NKFormType.NUMBER,
                              span: 3,
                            },

                            {
                              label: 'Mô tả',
                              name: 'note',
                              type: NKFormType.TEXTAREA,
                              span: 3,
                            },
                          ]}
                          title=""
                          defaultValues={{
                            endOfWarrantyDate: nkMoment().format('YYYY-MM-DD'),
                            equipmentId: '',
                            expiredDate: nkMoment().format('YYYY-MM-DD'),
                            mfDate: nkMoment().format('YYYY-MM-DD'),
                            note: '',
                            price: 0,
                            quantity: 1,
                            supplyId: null,
                            brandId: '',
                            code: '',
                            description: '',
                            equipmentCategoryId: '',
                            equipmentStatus: '',
                            imageUrls: [],
                            importDate: '',
                            name: '',
                          }}
                        />
                      )}
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
                        selectedRowGroup.map(async (item) => {
                          await importInventoryApi.v1DeleteItem(queryData?.data?.id || '', item.id);
                          if (item.equipment) {
                            await equipmentApi.v1Delete(item.equipment.id);
                          }
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
            {Boolean(queryData.data?.importPlan) && (
              <>
                <Table
                  dataSource={[
                    ...(queryData.data?.importPlan?.importPlanItems.map((item) => {
                      const importInventoryItem = queryData.data?.importInventoryItems.find((i) => i.supply?.code === item?.code);
                      const importPlanItem = queryData.data?.importPlan?.importPlanItems.find((i) => i.code === item.code);
                      let importInventoryItemQuantity = queryData.data?.importInventoryItems
                        .filter((i) => i.supply?.code === item?.code)
                        .reduce((a, b) => a + b.quantity, 0);
                      if (queryData.data.status === 'APPROVED') {
                        importInventoryItemQuantity = 0;
                      }

                      const importedInventoryQuantity = (importPlanQuery.data?.importInventories.filter((i) => i.status === 'APPROVED') || [])
                        .map((subItem) => {
                          return subItem.importInventoryItems.filter((i) => i.supply?.code === item?.code);
                        })
                        .flat()
                        .reduce((a, b) => a + b.quantity, 0);

                      const supply = allSupplies.data?.find((i) => {
                        return i.code === item.code;
                      });

                      return {
                        createdAt: '',
                        updatedAt: '',
                        docStatus: 1,
                        endOfWarrantyDate: '',
                        equipment: null,
                        expiredDate: importInventoryItem?.expiredDate || '',
                        id: supply?.id || '',
                        isDeleted: false,
                        isRequiredUpdate: false,
                        mfDate: importInventoryItem?.mfDate || '',
                        note: importInventoryItem?.note || '',
                        price: importInventoryItem?.price || 0,
                        quantity: importInventoryItemQuantity,
                        importedQuantity: importedInventoryQuantity,
                        importInventoryItemId: importInventoryItem?.id || '',
                        code: item.code,
                        supply: supply,
                        importItem: queryData.data?.importInventoryItems.filter((i) => i.supply?.code === item?.code),
                        planQuantity: importPlanItem?.quantity || 0,
                      };
                    }) || []),
                  ]}
                  className="fade-in"
                  id="import-plan"
                  rowKey="id"
                  size="small"
                  summary={(data) => {
                    const totalQuantity = data.reduce((a, b) => a + b.planQuantity, 0);
                    const totalImportedQuantity = data.reduce((a, b) => a + b.importedQuantity, 0);
                    const remainQuantity = totalQuantity - totalImportedQuantity;
                    let totalImportingQuantity = data.reduce((a, b) => a + b.quantity, 0);
                    if (queryData.data?.status === 'APPROVED') {
                      totalImportingQuantity = 0;
                    }
                    return (
                      <Table.Summary.Row className="font-bold">
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={0} className="font-bold">
                          Tổng
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1} className="font-bold"></Table.Summary.Cell>
                        <Table.Summary.Cell index={2} className="font-bold"></Table.Summary.Cell>
                        <Table.Summary.Cell index={3} className="font-bold"></Table.Summary.Cell>

                        <Table.Summary.Cell index={5} className="font-bold">
                          {totalQuantity}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={6} className="font-bold">
                          {totalImportedQuantity}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={7} className="font-bold">
                          {remainQuantity}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={8} className="font-bold">
                          {totalImportingQuantity}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={9} className="font-bold"></Table.Summary.Cell>
                        <Table.Summary.Cell index={10} className="font-bold"></Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                  expandable={{
                    expandedRowRender: (record) => {
                      return (
                        <Table
                          dataSource={record.importItem.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                          className="fade-in"
                          id="import-plan"
                          rowKey="id"
                          size="small"
                          columns={[
                            {
                              title: 'Ngày sản xuất',
                              key: 'mfDate',
                              width: 200,
                              render: (record: ImportInventoryItem) => {
                                const value = _get(record, 'mfDate') || new Date().toString();
                                return <FieldDisplay value={value} type={FieldType.TIME_DATE} />;
                              },
                            },
                            {
                              title: 'Hạn dùng',
                              key: 'expiredDate',
                              width: 200,
                              render: (record: ImportInventoryItem) => {
                                const value = _get(record, 'expiredDate') || new Date().toString();
                                return <FieldDisplay value={value} type={FieldType.TIME_DATE} />;
                              },
                            },
                            {
                              title: 'Mô tả',
                              key: 'note',
                              render: (record: ImportInventoryItem) => {
                                const value = _get(record, 'note');
                                return <FieldMultipleText value={value} />;
                              },
                            },
                            {
                              title: 'Số lượng',
                              key: 'quantity',
                              width: 400,
                              render: (record: ImportInventoryItem) => {
                                const value = _get(record, 'quantity', 0);
                                return <FieldNumber value={value.toString()} />;
                              },
                            },
                            {
                              key: 'id',
                              title: '',
                              width: 200,
                              render: (subRecord: ImportInventoryItem) => {
                                return (
                                  <div className="flex gap-2">
                                    {!isSelect && isDraft && (
                                      <>
                                        {!queryData.data?.importPlan && (
                                          <>
                                            <CTAButton
                                              extraOnSuccess={async () => {
                                                queryData.refetch();
                                                if (subRecord.equipment) {
                                                  await equipmentApi.v1Delete(subRecord.equipment.id);
                                                }
                                              }}
                                              ctaApi={() => {
                                                return importInventoryApi.v1DeleteItem(queryData?.data?.id || '', subRecord.id);
                                              }}
                                              isConfirm
                                              confirmMessage="Bạn có chắc chắn muốn xoá sản phẩm này?"
                                            >
                                              <Button size="small" type="primary" danger icon={<DeleteOutlined rev="" />}></Button>
                                            </CTAButton>
                                          </>
                                        )}
                                        <ModalBuilder
                                          btnLabel=""
                                          modalTitle={`Chỉnh sửa hàng hóa`}
                                          btnProps={{
                                            size: 'small',
                                            icon: <EditOutlined rev="" />,
                                          }}
                                        >
                                          <FormBuilder<ImportInventoryItemIV1UpdateDto>
                                            apiAction={(dto) => {
                                              const otherImportInventoryQuantity =
                                                queryData.data?.importInventoryItems
                                                  .filter((i) => i.supply.code === subRecord.supply.code)
                                                  .filter((i) => i.id !== subRecord.id)
                                                  .reduce((a, b) => a + b.quantity, 0) || 0;

                                              const importPlanQuantity = _get(record, 'planQuantity', 0);
                                              const importedQuantity = _get(record, 'importedQuantity', 0);

                                              if (importPlanQuantity < dto.quantity + otherImportInventoryQuantity + importedQuantity) {
                                                toast.error('Số lượng nhập không được lớn hơn số lượng trong kế hoạch');
                                                return Promise.reject();
                                              }

                                              const importInventoryItemId = _get(subRecord, 'importInventoryItemId');

                                              return importInventoryApi.v1UpdateItem(queryData?.data?.id || '', subRecord.id || '', dto);
                                            }}
                                            btnLabel="Cập nhật"
                                            onExtraSuccessAction={() => {
                                              queryData.refetch();
                                            }}
                                            setFormMethods={(data) => setFormMethods(data)}
                                            fields={[
                                              {
                                                label: 'Số lượng',
                                                name: 'quantity',
                                                type: NKFormType.NUMBER,
                                                span: 3,
                                              },

                                              {
                                                label: 'Mô tả',
                                                name: 'note',
                                                type: NKFormType.TEXTAREA,
                                                span: 3,
                                              },
                                            ]}
                                            title=""
                                            defaultValues={{
                                              quantity: subRecord.quantity || 0,
                                              endOfWarrantyDate: subRecord.endOfWarrantyDate || nkMoment().format('YYYY-MM-DD'),
                                              expiredDate: subRecord.expiredDate || nkMoment().format('YYYY-MM-DD'),
                                              mfDate: subRecord.mfDate || nkMoment().format('YYYY-MM-DD'),
                                              note: subRecord.note || '',
                                              price: subRecord.price || 0,
                                            }}
                                          />
                                        </ModalBuilder>

                                        <CTAButton
                                          extraOnSuccess={async () => {
                                            queryData.refetch();
                                            if (subRecord.equipment) {
                                              await equipmentApi.v1Delete(subRecord.equipment.id);
                                            }
                                          }}
                                          ctaApi={() => {
                                            return importInventoryApi.v1DeleteItem(queryData?.data?.id || '', subRecord.id);
                                          }}
                                          isConfirm
                                          confirmMessage="Bạn có chắc chắn muốn xoá sản phẩm này?"
                                        >
                                          <Button size="small" type="primary" danger icon={<DeleteOutlined rev="" />}></Button>
                                        </CTAButton>
                                      </>
                                    )}
                                  </div>
                                );
                              },
                            },
                          ]}
                          pagination={false}
                        />
                      );
                    },
                  }}
                  columns={[
                    {
                      key: 'code',
                      title: 'Mã thiết bị',
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'supply.code') || _get(record, 'equipment.code') || '';
                        return <FieldText value={value} />;
                      },
                    },
                    {
                      key: 'name',
                      title: 'Tên hàng',
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'supply.name') || _get(record, 'equipment.name') || '';
                        return <FieldText value={value} />;
                      },
                    },

                    {
                      key: 'category',
                      title: 'Loại thiết bị',
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'equipment.equipmentCategory.name') || _get(record, 'supply.supplyCategory.name') || '';
                        return <FieldText value={value} />;
                      },
                    },
                    {
                      key: 'unit',
                      title: 'Đơn vị tính',
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'supply.unit') || 'Máy';
                        return <FieldText value={value} />;
                      },
                    },
                    {
                      key: 'quantity',
                      title: 'Sl trong kế hoạch',
                      width: 100,
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'planQuantity', 0);
                        return <FieldNumber value={value.toString()} />;
                      },
                    },
                    {
                      key: 'quantity',
                      title: 'Sl đã nhập',
                      width: 100,
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'importedQuantity', 0);
                        return <FieldNumber value={value.toString()} />;
                      },
                    },
                    {
                      key: 'quantity',
                      title: 'Sl còn lại',
                      width: 100,
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'planQuantity', 0) - _get(record, 'importedQuantity', 0);
                        return <FieldNumber value={value.toString()} />;
                      },
                    },
                    {
                      key: 'quantity',
                      title: 'Sl đang nhập',
                      width: 100,
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'quantity', 0);
                        return <FieldNumber value={value.toString()} />;
                      },
                    },

                    {
                      key: 'price',
                      title: 'Đơn giá',
                      width: 200,
                      render: (record: ImportInventoryItem) => {
                        let value = _get(record, 'price');
                        if (queryData.data?.importPlan) {
                          const importPlanItem = queryData.data.importPlan.importPlanItems.find((item) => item.code === record?.supply?.code);
                          value = importPlanItem?.price || 0;
                        }
                        return <FieldNumber value={value.toString()} />;
                      },
                    },
                    {
                      key: 'total',
                      title: 'Thành tiền',
                      width: 200,
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'price') * _get(record, 'quantity');
                        return <FieldNumber value={value.toString()} />;
                      },
                    },
                    {
                      key: 'id',
                      title: '',
                      width: 50,
                      render: (record: ImportInventoryItem) => {
                        return (
                          <>
                            {isDraft && (
                              <ModalBuilder
                                btnLabel=""
                                modalTitle={`Thêm Vật Tư`}
                                btnProps={{
                                  size: 'small',
                                  type: 'primary',
                                  icon: <PlusOutlined rev="" />,
                                }}
                              >
                                {(close) => (
                                  <FormBuilder<ImportInventoryItemIV1CreateDto>
                                    apiAction={(dto) => {
                                      if (queryData.data?.importPlan) {
                                        const supply = allSupplies.data?.find((item) => item.id === dto.supplyId);
                                        const importPlanItem = queryData.data.importPlan.importPlanItems.find((item) => item.code === supply?.code);
                                        const existItemQuantity =
                                          queryData.data.importInventoryItems
                                            .filter((item) => item.supply.code === supply?.code)
                                            .reduce((a, b) => a + b.quantity, 0) || 0;

                                        const importedInventoryQuantity = (
                                          importPlanQuery.data?.importInventories.filter((i) => i.status === 'APPROVED') || []
                                        )
                                          .map((subItem) => {
                                            return subItem.importInventoryItems.filter((i) => i.supply.code === supply?.code);
                                          })
                                          .flat()
                                          .reduce((a, b) => a + b.quantity, 0);

                                        if (importPlanItem) {
                                          if (importPlanItem.quantity < dto.quantity + existItemQuantity + importedInventoryQuantity) {
                                            toast.error('Số lượng nhập không được lớn hơn số lượng trong kế hoạch');
                                            return Promise.reject();
                                          }
                                          dto.price = importPlanItem.price;
                                        }
                                      }

                                      return importInventoryApi.v1CreateItem(queryData?.data?.id || '', {
                                        ...dto,
                                        endOfWarrantyDate: dto.expiredDate,
                                      });
                                    }}
                                    onExtraSuccessAction={() => {
                                      queryData.refetch();
                                      close();
                                    }}
                                    btnLabel="Thêm"
                                    fields={[
                                      {
                                        label: 'Tên hàng ',
                                        name: 'supplyId',
                                        type: NKFormType.SELECT_API_OPTION,
                                        fieldProps: {
                                          disabled: true,
                                        },
                                        span: 3,
                                        useAction: async (value) => {
                                          let res = await supplyApi.v1Select(value);
                                          if (queryData.data?.importPlan) {
                                            const importPlanCode = queryData.data.importPlan.importPlanItems.map((item) => item.code);

                                            res = res.filter((item) => importPlanCode.includes(item.code));
                                          }

                                          return res;
                                        },
                                      },
                                      {
                                        label: 'Ngày sản xuất',
                                        name: 'mfDate',
                                        type: NKFormType.DATE,
                                        span: 3,
                                      },
                                      {
                                        label: 'Hạn dùng',
                                        name: 'expiredDate',
                                        type: NKFormType.DATE,
                                        span: 3,
                                      },
                                      ...(queryData.data?.importPlan
                                        ? []
                                        : ([
                                            {
                                              label: 'Đơn giá',
                                              name: 'price',
                                              type: NKFormType.NUMBER,
                                              span: 3,
                                            },
                                          ] as any)),
                                      {
                                        label: 'Số lượng',
                                        name: 'quantity',
                                        type: NKFormType.NUMBER,
                                        span: 3,
                                      },
                                      // {
                                      //   label: 'Mô tả',
                                      //   name: 'note',
                                      //   type: NKFormType.TEXTAREA,
                                      //   span: 3,
                                      // },
                                    ]}
                                    title=""
                                    defaultValues={{
                                      endOfWarrantyDate: nkMoment().format('YYYY-MM-DD'),
                                      equipmentId: null,
                                      expiredDate: nkMoment().format('YYYY-MM-DD'),
                                      mfDate: nkMoment().format('YYYY-MM-DD'),
                                      note: 'Nhập kho',
                                      price: 0,
                                      quantity: 1,
                                      supplyId: record.supply.id,
                                    }}
                                  />
                                )}
                              </ModalBuilder>
                            )}
                          </>
                        );
                      },
                    },
                  ]}
                  pagination={false}
                />
              </>
            )}
            {!Boolean(queryData.data?.importPlan) && (
              <>
                <Table
                  dataSource={queryData.data?.importInventoryItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                  className="fade-in"
                  id="import-plan"
                  rowKey="id"
                  size="small"
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
                  summary={(data) => {
                    const totalImportedQuantity = data.reduce((a, b) => a + b.quantity, 0);
                    return (
                      <Table.Summary.Row className="font-bold">
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={0} className="font-bold">
                          Tổng
                        </Table.Summary.Cell>
                        {isDraft && <Table.Summary.Cell index={1}></Table.Summary.Cell>}
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={2}></Table.Summary.Cell>
                        <Table.Summary.Cell index={3}></Table.Summary.Cell>

                        <Table.Summary.Cell index={5} className="font-bold"></Table.Summary.Cell>
                        <Table.Summary.Cell index={6} className="font-bold">
                          {totalImportedQuantity}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={7} className="font-bold"></Table.Summary.Cell>
                        <Table.Summary.Cell index={8} className="font-bold"></Table.Summary.Cell>
                        <Table.Summary.Cell index={9} className="font-bold"></Table.Summary.Cell>
                        <Table.Summary.Cell index={10}></Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                  columns={[
                    {
                      key: 'code',
                      title: 'Mã thiết bị',
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'supply.code') || _get(record, 'equipment.code') || '';
                        return <FieldText value={value} />;
                      },
                    },
                    {
                      key: 'name',
                      title: 'Tên hàng',
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'supply.name') || _get(record, 'equipment.name') || '';
                        return <FieldText value={value} />;
                      },
                    },

                    {
                      key: 'category',
                      title: 'Loại thiết bị',
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'equipment.equipmentCategory.name') || _get(record, 'supply.supplyCategory.name') || '';
                        return <FieldText value={value} />;
                      },
                    },
                    {
                      key: 'code',
                      title: 'Ngày sản xuất',
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'mfDate') || new Date().toString();
                        return <FieldDisplay value={value} type={FieldType.TIME_DATE} />;
                      },
                    },
                    {
                      key: 'code',
                      title: 'Hạn dùng',
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'expiredDate') || new Date().toString();
                        return <FieldDisplay value={value} type={FieldType.TIME_DATE} />;
                      },
                    },
                    {
                      key: 'description',
                      title: 'Mô tả',
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'note');
                        return <FieldMultipleText value={value} />;
                      },
                    },
                    ...(Boolean(queryData.data?.importPlan)
                      ? ([
                          // {
                          //   label: 'Số lượng trong kế hoạch',
                          //   name: 'quantity',
                          //   type: NKFormType.NUMBER,
                          //   span: 3,
                          // },
                          {
                            key: 'quantity',
                            title: 'Số lượng trong kế hoạch',
                            render: (record: ImportInventoryItem) => {
                              const value = _get(record, 'planQuantity', 0);
                              return <FieldNumber value={value.toString()} />;
                            },
                          },
                        ] as any)
                      : []),
                    {
                      key: 'quantity',
                      title: 'SL nhập',
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'quantity', 0);
                        return <FieldNumber value={value.toString()} />;
                      },
                    },
                    {
                      key: 'unit',
                      title: 'Đơn vị tính',
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'supply.unit') || 'Máy';
                        return <FieldText value={value} />;
                      },
                    },

                    {
                      key: 'price',
                      title: 'Đơn giá',
                      render: (record: ImportInventoryItem) => {
                        let value = _get(record, 'price');
                        if (queryData.data?.importPlan) {
                          const importPlanItem = queryData.data.importPlan.importPlanItems.find((item) => item.code === record.supply.code);
                          value = importPlanItem?.price || 0;
                        }
                        return <FieldNumber value={value.toString()} />;
                      },
                    },
                    {
                      key: 'total',
                      title: 'Thành tiền',
                      render: (record: ImportInventoryItem) => {
                        const value = _get(record, 'price') * _get(record, 'quantity');
                        return <FieldNumber value={value.toString()} />;
                      },
                    },

                    {
                      key: 'id',
                      title: '',
                      width: 50,
                      render: (record: ImportInventoryItem) => {
                        return (
                          <div className="flex gap-2">
                            {!isSelect && isDraft && (
                              <>
                                {!queryData.data?.importPlan && (
                                  <>
                                    <CTAButton
                                      extraOnSuccess={async () => {
                                        queryData.refetch();
                                        if (record.equipment) {
                                          await equipmentApi.v1Delete(record.equipment.id);
                                        }
                                      }}
                                      ctaApi={() => {
                                        return importInventoryApi.v1DeleteItem(queryData?.data?.id || '', record.id);
                                      }}
                                      isConfirm
                                      confirmMessage="Bạn có chắc chắn muốn xoá sản phẩm này?"
                                    >
                                      <Button size="small" type="primary" danger icon={<DeleteOutlined rev="" />}></Button>
                                    </CTAButton>
                                  </>
                                )}
                                <ModalBuilder
                                  btnLabel=""
                                  modalTitle={`Chỉnh sửa hàng hóa`}
                                  btnProps={{
                                    size: 'small',
                                    icon: <EditOutlined rev="" />,
                                  }}
                                >
                                  <FormBuilder<ImportInventoryItemIV1UpdateDto>
                                    apiAction={(dto) => {
                                      return importInventoryApi.v1UpdateItem(queryData?.data?.id || '', record.id || '', dto);
                                    }}
                                    btnLabel="Cập nhật"
                                    onExtraSuccessAction={() => {
                                      queryData.refetch();
                                    }}
                                    setFormMethods={(data) => setFormMethods(data)}
                                    fields={[
                                      {
                                        label: 'Ngày sản xuất',
                                        name: 'mfDate',
                                        type: NKFormType.DATE,
                                        span: 3,
                                      },
                                      {
                                        label: 'Hạn dùng',
                                        name: 'expiredDate',
                                        type: NKFormType.DATE,
                                        span: 3,
                                      },
                                      {
                                        label: 'Hạn bảo hành',
                                        name: 'endOfWarrantyDate',
                                        type: NKFormType.DATE,
                                        span: 3,
                                      },
                                      {
                                        label: 'Đơn giá',
                                        name: 'price',
                                        type: NKFormType.NUMBER,
                                        span: 3,
                                      },

                                      {
                                        label: 'Số lượng',
                                        name: 'quantity',
                                        type: NKFormType.NUMBER,
                                        span: 3,
                                      },

                                      {
                                        label: 'Mô tả',
                                        name: 'note',
                                        type: NKFormType.TEXTAREA,
                                        span: 3,
                                      },
                                    ]}
                                    title=""
                                    defaultValues={{
                                      quantity: record.quantity || 0,
                                      endOfWarrantyDate: record.endOfWarrantyDate || nkMoment().format('YYYY-MM-DD'),
                                      expiredDate: record.expiredDate || nkMoment().format('YYYY-MM-DD'),
                                      mfDate: record.mfDate || nkMoment().format('YYYY-MM-DD'),
                                      note: record.note || '',
                                      price: record.price || 0,
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
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
