import { Tooltip } from 'antd';
import React from 'react';
import * as Icon from 'react-feather';
import { useIntl } from 'react-intl';

interface IProps {
  onClick?: () => void;
  disable?: boolean;
}
const AnswerComponent = (props: IProps) => {
  const intl = useIntl();
  const onClick = e => {
    props?.onClick && props?.onClick();
    e.stopPropagation();
  };
  if (props.disable) return <></>;
  return (
    <Tooltip title={intl.formatMessage({ id: 'common.answer', defaultMessage: 'common.answer' })}>
      <Icon.MessageSquare
        onClick={onClick}
        className={`icon-edit ${props?.disable ? 'icon-disable' : ''}`}
        size="19"
      />
    </Tooltip>
  );
};

export default AnswerComponent;
