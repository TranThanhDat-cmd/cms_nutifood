import { Button } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { useAltaIntl } from '@shared/hook/useTranslate';

interface IButtonForm {
  nameButtonSubmit: string;
  className?: string;
  formName: string;
  isLoading?: boolean;
  onCancelForm?: any;
  onOk?: any;
  isDisabled?: any;
}

const ButtonForm: React.FC<IButtonForm> = ({
  nameButtonSubmit,
  className,
  formName,
  isLoading = false,
  onCancelForm,
  isDisabled = false,
  onOk,
}) => {
  const { formatMessage } = useAltaIntl();
  const history = useHistory();
  return (
    <div className={`button-center__box ${className}`}>
      {isDisabled ? (
        <Button
          className="cancel-button"
          onClick={onCancelForm ? onCancelForm : () => history.goBack()}
        >
          {formatMessage('common.close')}
        </Button>
      ) : (
        <>
          <Button
            className="cancel-button mr-5"
            onClick={onCancelForm ? onCancelForm : () => history.goBack()}
          >
            {formatMessage('common.cancel')}
          </Button>
          <Button
            loading={isLoading}
            type="primary"
            className="normal-button"
            htmlType="submit"
            form={formName}
            disabled={isDisabled}
            onClick={onOk && onOk}
          >
            {formatMessage(nameButtonSubmit)}
          </Button>
        </>
      )}
    </div>
  );
};
export default ButtonForm;
