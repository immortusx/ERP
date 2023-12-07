import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  isFetching: false,
  isSuccess: false,
  isError: false,
  userTaskList: [],
};

export const getUserTaskList = createAsyncThunk(
  'getUserTaskList/getUserTaskListSlice',
  async () => {
    const url = `${API_URL}/api/get-user-task-list`;
    console.log('get user task list', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    console.log(config);

    const response = await axios.get(url, config);
    console.log(response.data, 'userTask List');
    
    return response.data.result;
  },
);

const getUserTaskListSlice = createSlice({
  name: 'getUserTaskListState',
  initialState,
  reducers: {
    clearUserTaskListState: state => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.userTaskList = [];
    },
  },

  extraReducers: builder => {
    builder.addCase(getUserTaskList.pending, state => {
      state.isFetching = true;
      state.isSuccess = false;
    });
    builder.addCase(getUserTaskList.fulfilled, (state, action) => {
      state.isFetching = false;
      state.isError = false;
      state.isSuccess = true;
      state.userTaskList = action.payload;
    });
    builder.addCase(getUserTaskList.rejected, (state, action) => {
      state.isError = true;
      state.isFetching = false;
    });
  },
});

export const { clearUserTaskListState } = getUserTaskListSlice.actions;
export default getUserTaskListSlice.reducer;
