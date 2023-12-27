import * as React from 'react';

import _get from 'lodash/get';

import FieldBadgeApi from './FieldBadgeApi';
import FieldBoolean from './FieldBoolean';
import FiledFirstImages from './FieldFirstImages';
import FieldLink from './FieldLink';
import FieldLinkButton from './FieldLinkButton';
import FiledMultipleImage from './FieldMultipleImages';
import FieldMultipleText from './FieldMultipleText';
import FieldNumber from './FieldNumber';
import FieldRichText from './FieldRichText';
import FieldRouter from './FieldRouter';
import FieldText from './FieldText';
import FieldThumbnail from './FieldThumbnail';
import FieldTime from './FieldTime';
import FieldUuid from './FieldUuid';

export enum FieldType {
  UUID = 'uuid',
  TEXT = 'text',
  ROUTER = 'router',
  NUMBER = 'number',
  MULTILINE_TEXT = 'multiline_text',
  BOOLEAN = 'boolean',
  THUMBNAIL = 'thumbnail',
  MULTIPLE_IMAGES = 'multiple_images',
  FIRST_IMAGES = 'first_images',
  RICH_TEXT = 'rich_text',
  TIME_FULL = 'time_full',
  TIME_DATE = 'time_date',
  TIME_HOUR = 'time_hour',
  LINK_BUTTON = 'link_button',
  LENGTH = 'length',
  BADGE_API = 'badge_api',
  LINK = 'link',
}

interface FieldDisplayProps {
  type: FieldType;
  value: any;
  apiAction?: (data: any) => Promise<any[]>;
  formatter?: (value: any) => any;
}

const FieldDisplay: React.FC<FieldDisplayProps> = ({ type, value, apiAction, formatter }) => {
  if (formatter) {
    value = formatter(value);
  }

  switch (type) {
    case FieldType.UUID:
      return <FieldUuid value={value} />;
    case FieldType.TEXT:
      return <FieldText value={value} />;
    case FieldType.TIME_FULL:
      return <FieldTime value={value} format="DD/MM/YYYY HH:mm:ss" />;
    case FieldType.TIME_DATE:
      return <FieldTime value={value} format="DD/MM/YYYY" />;
    case FieldType.TIME_HOUR:
      return <FieldTime value={value} format="HH:mm:ss" />;
    case FieldType.BOOLEAN:
      return <FieldBoolean value={value} />;
    case FieldType.LINK_BUTTON:
      return <FieldLinkButton value={value} />;
    case FieldType.THUMBNAIL:
      return <FieldThumbnail value={value} />;
    case FieldType.MULTIPLE_IMAGES:
      return <FiledMultipleImage value={value} />;
    case FieldType.MULTILINE_TEXT:
      return <FieldMultipleText value={value} />;
    case FieldType.ROUTER:
      return <FieldRouter value={value} apiAction={apiAction} />;
    case FieldType.NUMBER:
      return <FieldNumber value={value} />;
    case FieldType.BADGE_API:
      return <FieldBadgeApi value={value} apiAction={apiAction} />;
    case FieldType.RICH_TEXT:
      return <FieldRichText value={value} />;
    case FieldType.FIRST_IMAGES:
      return <FiledFirstImages value={value} />;
    case FieldType.LINK:
      return <FieldLink value={value} apiAction={apiAction} />;
    case FieldType.LENGTH:
      const length = _get(value, 'length');
      return <FieldText value={length} />;
  }

  return <div>{value}</div>;
};

export default FieldDisplay;
