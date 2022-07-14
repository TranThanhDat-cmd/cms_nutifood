import './style.scss';

import { Badge } from 'antd';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface IBadge {
  status?: boolean;
  id?: string;
}
const _BadgeBoolean: React.FC<IBadge> = props => {
  const status = React.useMemo<PresetStatusColorType>(() => {
    if (props.status == true) {
      return 'success';
    }
    if (props.status == false) {
      return 'error';
    }
    return 'warning';
  }, [props.status]);
  if (props.status === undefined) {
    return <span>--</span>;
  }
  return (
    <Badge
      status={status}
      text={
        <FormattedMessage
          id={props.id || 'common.status.param'}
          values={{ status: props.status }}
        />
      }
      className={props.status == true ? 'badgeBoolean-success' : 'badgeBoolean-error'}
    />
  );
};

export default React.memo(_BadgeBoolean);
