import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { RootState } from '@modules';
import UserEntity from '@modules/user/entity';
import { Selector } from '@reduxjs/toolkit';
import { imgAvatar } from '@shared/assets/images';
import ChangeLanguage from '@shared/components/ChangeLanguage';

interface IHeaderComponent {
  profile?: UserEntity;
}

const HeaderComponentSelector: Selector<RootState, IHeaderComponent> = (state: RootState) => {
  return {
    profile: state.profile.user,
  };
};

const HeaderComponent = () => {
  const { profile } = useSelector(HeaderComponentSelector);
  const history = useHistory();

  return (
    <div className="header-component">
      <div className="header-component__language">
        <ChangeLanguage />
      </div>
      {/* <div className="notification-badge">
        <Badge count={9} overflowCount={10}>
          <BellOutlined shape="square" />
        </Badge>
      </div> */}

      <div className="header-component__dropdown">
        <div className="dropdown__profile__img">
          <img alt="img-avatar" className="img-avatar" src={profile?.avatar || imgAvatar} />
        </div>
      </div>
      <div
        className="header-component__identify"
        onClick={() => {
          history.push('/profile');
        }}
      >
        <h4 className="identify__admin">{profile?.fullName}</h4>
        <p className="identify__place">{profile?.emailAddress || 'Unknown'}</p>
      </div>
    </div>
  );
};

export default memo(HeaderComponent);
