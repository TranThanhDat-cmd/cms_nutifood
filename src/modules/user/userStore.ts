import { createSlice } from '@reduxjs/toolkit';

export interface UserStore {
  listUser: [];
  userEdited: any;
}
const initialState: UserStore = {
  listUser: [],
  userEdited: null,
};

const UserStore = createSlice({
  name: 'UserStore',
  initialState,
  reducers: {
    getListUser: (state, action) => {
      if (action.payload && action.payload.data) {
        state.listUser = action.payload.data;
      }
      console.log(state, action);
      return state;
    },
    setUserEdited: (state, action) => {
      state.userEdited = action.payload.userEdited;
    },
  },
});

export default UserStore;
