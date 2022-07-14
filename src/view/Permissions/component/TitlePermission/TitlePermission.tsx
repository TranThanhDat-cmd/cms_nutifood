import { Col, Row } from 'antd';
import React from 'react';

import { useAltaIntl } from '@shared/hook/useTranslate';

const TitlePermission = () => {
  const { formatMessage } = useAltaIntl();
  return (
    <Row className="module-item-title-box">
      <Col span={2} className="module-item-index">
        {formatMessage('common.stt')}
      </Col>
      <Col span={5} className="module-item-title">
        {formatMessage('roles.name')}
      </Col>
      <Col span={5} className="module-item-checkAll">
        {formatMessage('common.checkAll')}
      </Col>
      <Col flex={1} className="text-left">
        {formatMessage('roles.rolePermissions')}
      </Col>
    </Row>
  );
};

export default TitlePermission;
