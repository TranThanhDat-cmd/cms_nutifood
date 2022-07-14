import React, { useEffect, useRef } from 'react';

import ViewEntity from './view';

interface IViewProductNew {
  url: string;
  zoomValue?: number;
  speedValue?: number;
}
const ViewProductNew: React.FC<IViewProductNew> = props => {
  const ref = useRef<any>();
  useEffect(() => {
    const viewer= new ViewEntity(ref.current, props.url, props.zoomValue||0, props.speedValue||0);
    return () => {
      if(viewer.viewer!=null){
        viewer.viewer.clear();
      }
    };
  }, [props.url, props.zoomValue, props.speedValue]);

  return <div ref={ref} className="view__box"></div>;
};

export default ViewProductNew;
