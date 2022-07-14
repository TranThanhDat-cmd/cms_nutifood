import { Button, ButtonProps } from 'antd';
import React from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { useAltaIntl } from '@shared/hook/useTranslate';

interface IButtonAdd extends ButtonProps {}
const ButtonAdd: React.FC<IButtonAdd> = props => {
  const { formatMessage } = useAltaIntl();
  return (
    <Button className="normal-button" {...props}>
      <PlusOutlined />
      <span>{formatMessage('common.add')}</span>
    </Button>
  );
};

export default ButtonAdd;
