import { Tooltip } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { Flag } from 'react-feather';
interface IProps {
  onClick?: () => void;
  disable?: boolean;
}
const ReportIconComponent = (props: IProps) => {
  const intl = useIntl();
  const onClick = e => {
    props?.onClick && props?.onClick();
    e.stopPropagation();
  };

  if (props?.disable) {
    return <></>;
  }
  return (
    <Tooltip title={intl.formatMessage({ id: 'common.report' })}>
      <Flag
        className={`icon-edit ${props?.disable ? 'icon-disable' : ''}`}
        size={19}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export default ReportIconComponent;
