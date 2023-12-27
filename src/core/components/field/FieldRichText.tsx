import * as React from 'react';

interface FieldRichTextProps {
  value: any;
}

const FieldRichText: React.FC<FieldRichTextProps> = ({ value }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: value }} className="text-base font-normal prose prose-img:rounded-xl prose-img:m-0 prose-img:w-full" />
  );
};

export default FieldRichText;
