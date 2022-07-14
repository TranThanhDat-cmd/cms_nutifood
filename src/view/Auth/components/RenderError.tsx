import React from 'react';

import { ExclamationCircleOutlined } from '@ant-design/icons';

import { IError } from '../interface';

const RenderError: React.FC<IError> = props => {
  return (
    <div className="error-status">
      <ExclamationCircleOutlined />
      <p>{props.errorStatus}</p>
    </div>
  );
};

export default RenderError;
