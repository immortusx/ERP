import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  isFetching: false,
  isSuccess: false,
  isError: false,
  result: '',
};

export const getEnquiryData = createAsyncThunk(
  'getEnquiryData/getEnquirySlice',
  async () => {
    const url = `${API_URL}/api/enquiry/get-enquiries`;
    console.log('get Enquiry Url', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    console.log(config);
    const response = await axios.get(url, config);
    // console.log(response.data,'eeeeeeeeeeeeeeeee');
    return response.data;
  },
);

const getEnquirySlice = createSlice({
  name: 'getEnquiryState',
  initialState,
  reducers: {
    cleargetEnquiryState: state => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.result = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getEnquiryData.pending, state => {
        state.isFetching = true;
        state.isSuccess = false;
      })
      .addCase(getEnquiryData.fulfilled, (state, action) => {
        state.isFetching = false;
        state.isError = false;
        state.isSuccess = true;
        state.result = action.payload;
      })
      .addCase(getEnquiryData.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
      });
  },
});

export const { cleargetEnquiryState } = getEnquirySlice.actions;
export default getEnquirySlice.reducer;
