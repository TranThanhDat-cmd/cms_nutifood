import { Badge } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface IBadge {
  status?: number;
  id?: string;
}
const BadgeBanner: React.FC<IBadge> = props => {
  const status = React.useMemo<any>(() => {
    if (props.status == 0) {
      return 'banner.outside';
    }
    if (props.status == 1) {
      return 'banner.0-6';
    }
    if (props.status == 2) {
      return 'banner.6-12';
    }
    if (props.status == 3) {
      return 'banner.right.old';
    }
    if (props.status == 4) {
      return 'banner.right.family';
    }
    if (props.status == 5) {
      return 'banner.left.combo';
    }
    if (props.status == 6) {
      return 'banner.right.combo';
    }
    if (props.status == 7) {
      return 'banner.tv.specific';
    }
    if (props.status == 8) {
      return 'banner.tv.0to6';
    }
    if (props.status == 9) {
      return 'banner.tv.6to12';
    }
    if (props.status == 10) {
      return 'banner.tv.adult';
    }
    if (props.status == 11) {
      return 'banner.tv.family1';
    }
    if (props.status == 12) {
      return 'banner.tv.family2';
    }
    if (props.status == 13) {
      return 'banner.tv.fridge';
    }
    if (props.status == 14) {
      return 'banner.3-doctors';
    }
    return 'unknown';
  }, [props.status]);
  if (props.status === undefined) {
    return <span>--</span>;
  }
  return (
    <Badge
      status={status}
      text={
        <FormattedMessage
          id={props.id || 'banner.status.banner'}
          values={{ status: props.status }}
        />
      }
    />
  );
};

export default React.memo(BadgeBanner);
