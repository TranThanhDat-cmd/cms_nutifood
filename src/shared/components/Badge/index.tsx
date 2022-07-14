import { Badge } from 'antd';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface IBadge {
  status?: number;
  id?: string;
}
const _Badge: React.FC<IBadge> = props => {
  const status = React.useMemo<PresetStatusColorType>(() => {
    if (props.status == 0) {
      return 'error';
    }
    if (props.status == 1) {
      return 'success';
    }
    if (props.status == 2) {
      return 'processing';
    }
    if (props.status == 3) {
      return 'default';
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
    />
  );
};

export default React.memo(_Badge);
