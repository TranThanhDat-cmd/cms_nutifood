import React, { memo } from 'react';
import { ITitle } from '../inteface';

const TitleComponent: React.FC<ITitle> = props => {
  const className = props?.index == 2 ? 'secondary-title' : 'main-title';
  return (
    <p className={`${className} ${props.className}`} style={props.style}>
      {props.title}
    </p>
  );
};

export default memo(TitleComponent);
