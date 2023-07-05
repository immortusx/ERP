import axios from 'axios';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  isFetching: false,
  isSuccess: false,
  isError: false,
  result: '',
};

export const getVillageData = createAsyncThunk(
  'getVillageData/getAllVillageSlice',
  async () => {
    const branchId = await AsyncStorage.getItem('currentBranchId');
    const id = branchId ? branchId : ''
    const url = `${API_URL}/api/master/get-Village-by-branchId/${id}`;
    console.log('get all village', url);
    // console.log(id);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    // console.log(config);
    const response = await axios.get(url, config);
    // console.log(response.data,'response');
    return response.data;
  },
);

const getAllVillageSlice = createSlice({
  name: 'getVillageState',
  initialState,
  reducers: {
    cleargetVillageState: state => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.result = '';
    },
  },

  extraReducers: builder => {
    builder.addCase(getVillageData.pending, state => {
      state.isFetching = true;
      state.isSuccess = false;
    });
    builder.addCase(getVillageData.fulfilled, (state, action) => {
      state.isFetching = false;
      state.isError = false;
      state.isSuccess = true;
      state.result = action.payload;
    });
    builder.addCase(getVillageData.rejected, (state, action) => {
      state.isError = true;
      state.isFetching = false;
    });
  },
});

export const {cleargetVillageState} = getAllVillageSlice.actions;
export default getAllVillageSlice.reducer;
