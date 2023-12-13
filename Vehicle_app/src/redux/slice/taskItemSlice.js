import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  taskItem: {},
};

const taskItemSlice = createSlice({
  name: 'taskItem',
  initialState,
  reducers: {
    setTaskItem(state, action) {
      state.taskItem = action.payload;
    },
    clearTaskItem(state) {
      state.taskItem = {};
    },
  },
});

export const {setTaskItem, clearTaskItem} = taskItemSlice.actions;
export default taskItemSlice.reducer;
