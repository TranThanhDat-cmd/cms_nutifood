import { removeProfile } from '@modules/authentication/profileStore';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PermissionModule, Role } from './interface';

export interface RoleStore {
  status: 'init' | 'modified' | 'success';
  listPermission: Array<PermissionModule>;
  listRole: Role[];
  roleEdited: any;
  checkedListPermission: [];
}

const initialState: RoleStore = {
  status: 'init',
  listPermission: [],
  listRole: [],
  roleEdited: null,
  checkedListPermission: [],
};
export const incrementBy = createAction<number>('incrementBy');
const RoleStore = createSlice({
  name: 'RoleStore',
  initialState: initialState,
  reducers: {
    fetchListPermission: (
      state: RoleStore,
      action: PayloadAction<{
        data: Array<PermissionModule>;
      }>
    ) => {
      if (action.payload && action.payload.data) {
        state.listPermission = action.payload.data;
      }
      state.status = 'success';
      return state;
    },

    updateListPermission: (
      state: RoleStore,
      action: PayloadAction<{
        data: Array<PermissionModule>;
      }>
    ) => {
      if (action.payload && action.payload.data) {
        state.listPermission = action.payload.data;
      }
      state.status = 'modified';
      return state;
    },
    getListRole: (
      state: RoleStore,
      action: PayloadAction<{
        data: Array<Role>;
      }>
    ) => {
      if (action.payload && action.payload.data) {
        state.listRole = action.payload.data;
      }

      return state;
    },
    setRoleEdited: (state, action) => {
      state.roleEdited = action.payload.roleEdited;
    },
    setCheckedListPermission: (state, action) => {
      state.checkedListPermission = action.payload.data;
    },
    updateList: (
      state: RoleStore,
      action: PayloadAction<{
        data: Role;
        role: 'delete' | 'update' | 'add';
      }>
    ) => {
      const { role, data } = action.payload;
      const index = state.listRole.findIndex(item => item.roleId == data.roleId);

      switch (role) {
        case 'delete': {
          if (index != -1) {
            state.listRole.splice(index, 1);
          }
          return state;
        }
        case 'update': {
          state.listRole[index] = data;
          return state;
        }
        default: {
          state.listRole.push(data);
          return state;
        }
      }
    },
    removeProfile: (state: RoleStore, action: PayloadAction) => {
      console.log(action, 'acction store rolé');
    },
  },
  extraReducers: builder => {
    builder.addCase(removeProfile, (state, action) => {
      state.listPermission = [];
      state.status = 'init';
      return state;
    });
  },
});

export default RoleStore;
