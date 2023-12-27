import * as React from 'react';

import { PhotoProvider, PhotoView } from 'react-photo-view';

import FieldImage from './FieldImage';

interface FiledMultipleImageProps {
  value: string[];
}

const FiledFirstImages: React.FC<FiledMultipleImageProps> = ({ value }) => {
  if (!value.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap max-w-2xl gap-4">
      <div className="relative inline-block w-[100px] h-[100px]">
        <FieldImage src={value[0]} alt={`image`} className="w-full h-full" />
      </div>
    </div>
  );
};

export default FiledFirstImages;
