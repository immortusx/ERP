import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  getEnquiryState: {
    isFetching: false,
    isSuccess: false,
    isError: false,
    result: '',
  },
};

export const getEnquiryData = createAsyncThunk(
  'getEnquiryData/getEnquirySlice',
  async () => {
    const url = `${API_URL}/enquiry/enquiry-data`;
    console.log('get Enquiry Url', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    console.log(config);
    return  await axios.get(url, config).then(response => {
      console.log(response.data);
      return response.data;
    });
  },
);

const getEnquirySlice = createSlice({
  name: 'getEnquiryState',
  initialState,
  reducers: {
    cleargetEnquiryState: state => {
      state.getEnquiryState.isFetching = false;
      state.getEnquiryState.isSuccess = false;
      state.getEnquiryState.isError = false;
      state.getEnquiryState.result = '';
      return state;
    },
  },
  extraReducers: builder => {
    builder.addCase(getEnquiryData.pending, state => {
      state.getEnquiryState.isFetching = true;
      state.getEnquiryState.isSuccess = false;
    });
    builder.addCase(getEnquiryData.fulfilled, (state, action) => {
      state.getEnquiryState.isFetching = false;
      state.getEnquiryState.isError = false;
      state.getEnquiryState.isSuccess = true;
      state.getEnquiryState.result = action.payload;
    });
    builder.addCase(getEnquiryData.rejected, (state, action) => {
      state.getEnquiryState.isFetching = false;
      state.getEnquiryState.isError = true;
    });
  },
});

export const {cleargetEnquiryState} = getEnquirySlice.actions;
export default getEnquirySlice.reducer;
