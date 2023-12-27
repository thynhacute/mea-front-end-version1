import * as React from 'react';

import { PhotoProvider, PhotoView } from 'react-photo-view';

import FieldImage from './FieldImage';

interface FiledMultipleImageProps {
  value: string[];
}

const FiledMultipleImage: React.FC<FiledMultipleImageProps> = ({ value }) => {
  if (!value || !value.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap max-w-2xl gap-4">
      <PhotoProvider speed={() => 200} maskOpacity={0.7}>
        {value.map((image, index) => (
          <div key={index} className="relative inline-block w-[100px] h-[100px]">
            <PhotoView src={image} key={index}>
              <FieldImage src={image} alt={`${image}`} className="w-full h-full" />
            </PhotoView>
          </div>
        ))}
      </PhotoProvider>
    </div>
  );
};

export default FiledMultipleImage;
