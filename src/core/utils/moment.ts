import moment from 'moment-timezone';

import { NKConstant } from '../NKConstant';

type SupportedLanguages = (typeof NKConstant.SUPPORTED_LOCALES)[number];

const formatDate = (date?: string, locale: SupportedLanguages = NKConstant.FALLBACK_LOCALE) => {
  return moment(date).locale(locale).format('LL');
};

const formatFilter = (date: string | Date) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

const nkMoment = moment;
// setTime To vn
nkMoment.locale('vi');
//set timezone
nkMoment.tz.setDefault('Asia/Ho_Chi_Minh');

export const HKMoment = {
  formatDate,
  formatFilter,
};
export { nkMoment };
