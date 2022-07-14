import { Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { CameraOutlined } from '@ant-design/icons';
import { RootState } from '@modules';
import { noImg } from '@shared/assets/images';

import { IAvatar } from '../interface';

const AvatarUser: React.FC<IAvatar> = props => {
  const [imgUrl, setImgUrl] = useState<any>(null);
  const user = useSelector((state: RootState) => state.profile.user);
  useEffect(() => {
    setImgUrl(user?.avatar);
  }, [user]);
  return (
    <div className="avatar__box">
      <img
        alt="avatar"
        className=""
        src={imgUrl ? (typeof imgUrl == 'string' ? imgUrl : URL.createObjectURL(imgUrl)) : noImg}
      />
      <Form.Item name="avatar" hidden={true}>
        <Input hidden={true} />
      </Form.Item>
      {props.disabled !== true && (
        <div className="button-icon-upload">
          <label htmlFor="input-media">
            <CameraOutlined hidden={props.disabled} />
          </label>
          <input
            hidden
            onChange={e => {
              const media: any = e.target.files && e.target.files[0];
              setImgUrl(media);
              props.chooseFile(media);
            }}
            disabled={props.disabled}
            type="file"
            id="input-media"
            accept="image/png, image/jpeg, image/jpg"
          />
        </div>
      )}
      <div className="account-name">
        <p>{user?.fullName}</p>
      </div>
    </div>
  );
};

export default React.memo(AvatarUser);
