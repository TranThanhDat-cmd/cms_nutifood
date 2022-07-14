import { Tooltip } from 'antd';
import React from 'react';
import * as Icon from 'react-feather';
import { useIntl } from 'react-intl';
interface IProps {
  onClick?: () => void;
  disable?: boolean;
}
const EditIconComponent = (props: IProps) => {
  const intl = useIntl();
  const useTranslate = (key: string) => {
    return intl.formatMessage({ id: key, defaultMessage: key });
  };
  const onClick = e => {
    props?.onClick && props?.onClick();
    e.stopPropagation();
  };

  if (props?.disable) {
    return <></>;
  }
  return (
    <Tooltip title={useTranslate('common.edit')}>
      <Icon.Edit
        className={`icon-edit ${props?.disable ? 'icon-disable' : ''}`}
        size={19}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export default EditIconComponent;
