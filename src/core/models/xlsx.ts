export interface XLSXIncorrectItem<T> {
  data: T;
  errors: XLSXErrorMessage[];
}

export interface XLSXErrorMessage {
  column: string;
  message: string;
}

export interface XLSXImportPlanItem {
  name: number;
  code: string;
  machine: string;
  category: string;
  brand: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  contact: string;
}
