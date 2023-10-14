import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  enquiryState: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    result: '',
  },
};

export const setEnquiryDb = createAsyncThunk(
  'setEnquiryDb/enquirySlice',
  async (data) => {
    console.log('data', data);
    const id = await AsyncStorage.getItem('currentBranchId');
    const branchId = id ? id : ''
    data.branchId  = branchId;
    const url = `${API_URL}/api/enquiry/set-new-detail-enquiry`;
    console.log('enquiry url', url)
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    console.log(config);
    return axios.post(url, data, config).then(response => {
      return response.data;
    });
  },
);
const enquirySlice = createSlice({
  name: 'enquiryState',
  initialState,
  reducers: {
    clearEnquiryState: (state) => {
      state.enquiryState.isError = false;
      state.enquiryState.isSuccess = false;
      state.enquiryState.isFetching = false;
      state.enquiryState.result = '';
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setEnquiryDb.pending, state => {
      state.enquiryState.isFetching = true;
      state.enquiryState.isError = false;
    });
    builder.addCase(setEnquiryDb.fulfilled, (state, action) => {
      state.enquiryState.isFetching = false;
      state.enquiryState.isSuccess = true;
      state.enquiryState.result = action.payload;
    });
    builder.addCase(setEnquiryDb.rejected, (state, action) => {
      state.enquiryState.isFetching = false;
      state.enquiryState.isError = true;
    });
  },
});
export const {clearEnquiryState} = enquirySlice.actions;
export default enquirySlice.reducer;
