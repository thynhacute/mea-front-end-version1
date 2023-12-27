import * as React from 'react';

import { Button, ButtonProps, Modal } from 'antd';

interface ModalBuilderProps {
  btnLabel: string;
  modalTitle: string;
  btnProps?: ButtonProps;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  className?: string;
  width?: string;
}

const ModalBuilder: React.FC<ModalBuilderProps> = ({ btnLabel, modalTitle, btnProps, children, className, width }) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const close = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div>
      <Button {...btnProps} onClick={() => setIsDrawerOpen(true)}>
        {btnLabel}
      </Button>
      {isDrawerOpen && (
        <Modal width={width} className={className} open={isDrawerOpen} footer={null} onCancel={() => close()} title={modalTitle}>
          {<>{typeof children === 'function' ? children(close) : children}</>}
        </Modal>
      )}
    </div>
  );
};

export default ModalBuilder;
