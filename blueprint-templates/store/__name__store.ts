import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {{ camelCase name}} from "./__name__.repository";
import {{name}}Entity from "./{{name}}.entity";

interface I{{pascalCase name}}Store {
  list{{pascalCase name}}: Array<{{name}}Entity>
}

const {{name}}Store = createSlice({
  name: "{{name}}Store",
  initialState: {
    list{{pascalCase name}}: [],
  } as I{{pascalCase name}}Store,
  reducers: {
    updateList{{pascalCase name}}: (state, action: PayloadAction<Array<{{name}}Entity>>) => {
      list{{pascalCase name}} = action.payload;
    },
  },
});

export const {
  updateList{{pascalCase name}},
} = {{name}}Store.actions;

export default {{name}}Store;
