import store from '@core/store/redux';
import settingStore from '@modules/setting/settingStore';
import { Selector } from '@reduxjs/toolkit';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { LANGUAGE } from '@config/index';
import UilAngelDown from '@iconscout/react-unicons/icons/uil-angle-down';
import { Select } from 'antd';
import { RootState } from '@modules';
import { Locale } from '@locale/index';
interface Iprop {
  className?: string;
  style?: any;
}

interface IChangeLanguage {
  language: string;
}

const ChangeLanguageSelector: Selector<RootState, IChangeLanguage> = (state: RootState) => ({
  language: state.settingStore.language,
});

const ChangeLanguage = (props: Iprop) => {
  // JUST LANGUAGE
  const { language } = useSelector(ChangeLanguageSelector);
  const changeLanguage = (language: keyof Locale) => {
    store.dispatch(settingStore.actions.updateLanguage(language));
  };

  return (
    <div className={'select-custom'}>
      <Select value={language} options={LANGUAGE} onChange={changeLanguage}></Select>
    </div>
  );
};

export default memo(ChangeLanguage);
