import axios from 'axios';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
const initialState = {
  fastEnquiryState: {
    isFetching: false,
    isSuccess: false,
    isError: false,
    result: '',
  },
};

export const setFastEnquiryDb = createAsyncThunk(
  'setFastEnquiryDb/addFastEnquirySlice',
  async data => {
    console.log('fastData', data);
    const id = await AsyncStorage.getItem('currentBranchId');
    const branchId = id ? id : ''
    data.branchId  = branchId;
    const url = `${API_URL}/api/enquiry/set-new-fast-enquiry`;
    console.log('fast enquiry', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    console.log(config);
    await axios.post(url, data, config).then(response => {
      return response.data;
    });
  },
);

const fastEnquirySlice = createSlice({
  name: 'fastEnquiryState',
  initialState,
  reducers: {
    clearFastEnquiryState: state => {
      state.fastEnquiryState.isFetching = false;
      state.fastEnquiryState.isSuccess = false;
      state.fastEnquiryState.isError = false;
      state.fastEnquiryState.result = '';
      return state;
    },
  },
  extraReducers: builder => {
    builder.addCase(setFastEnquiryDb.pending, state => {
      state.fastEnquiryState.isFetching = true;
      state.fastEnquiryState.isError = false;
    });
    builder.addCase(setFastEnquiryDb.fulfilled, (state, action) => {
      state.fastEnquiryState.isFetching = false;
      state.fastEnquiryState.isSuccess = true;
      state.fastEnquiryState.result = action.payload;
    });
    builder.addCase(setFastEnquiryDb.rejected, (state, action) => {
      state.fastEnquiryState.isFetching = false;
      state.fastEnquiryState.isError = true;
    });
  },
});

export const {clearFastEnquiryState} = fastEnquirySlice.actions;
export default fastEnquirySlice.reducer;
