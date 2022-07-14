import { combineReducers } from '@reduxjs/toolkit';
import profileStore from './authentication/profileStore';
import translateStoreRedux from './setting/settingStore';
import userStore from '@modules/user/userStore';

const appReducer = combineReducers({
  profile: profileStore.reducer,
  settingStore: translateStoreRedux.reducer,
  userStore: userStore.reducer,
});

export type RootState = ReturnType<typeof appReducer>;
export default appReducer;
