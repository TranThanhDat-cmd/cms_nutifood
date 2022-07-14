import React, { useState } from 'react';
import { Slider } from 'antd';
import * as Icon from 'react-feather';
interface IVolume {
  max: number;
  min: number;
  handleChange: any;
  initialValue?: number;
}
const ChangeVolume: React.FC<IVolume> = ({ max, min, handleChange, initialValue = 0 }) => {
  const [volume, setVolume] = useState<number>(initialValue);
  const onChange = value => {
    setVolume(value);
    handleChange(value);
  };
  return (
    <div className="change-volume">
      <div>
        {volume === 0 ? (
          <Icon.Volume size="30" className="icon-feather" onClick={() => setVolume(100)} />
        ) : (
          <Icon.Volume2 size="30" className="icon-feather" onClick={() => setVolume(0)} />
        )}
      </div>
      <Slider max={max} min={min} onChange={onChange} value={volume} />
      <p>{volume}</p>
    </div>
  );
};

export default ChangeVolume;
