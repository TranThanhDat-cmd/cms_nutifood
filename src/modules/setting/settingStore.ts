import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';
import { Locale } from '@locale/index';
import { RootState } from '@modules';
interface IStore {
  language: keyof Locale;
}

const settingStore = createSlice({
  name: 'settingStore',
  initialState: {
    language: 'vi',
  } as IStore,
  reducers: {
    updateLanguage: (state, action: PayloadAction<keyof Locale>) =>
      Object.assign(state, { language: action.payload }),
  },
});

interface ILang {
  language: string;
}
export const LanguageSelector: Selector<RootState, ILang> = state => {
  return {
    language: state.settingStore.language,
  };
};

export default settingStore;
