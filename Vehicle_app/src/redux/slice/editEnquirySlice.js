import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  editEnquiryState: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    result: '',
  },
};

export const setEditEnquiryDb = createAsyncThunk(
  'setEditEnquiryDb/editEnquirySlice',
  async data => {
    console.log('data', data);
    const id = await AsyncStorage.getItem('currentBranchId');
    const branchId = id ? id : ''
    data.branchId  = branchId;
    const url = `${API_URL}/api/enquiry/edit-new-detail-enquiry`;
    console.log('edit enquiry url', url)
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
const editEnquirySlice = createSlice({
  name: 'editEnquiryState',
  initialState,
  reducers: {
    clearEditEnquiryState: state => {
      state.editEnquiryState.isError = false;
      state.editEnquiryState.isSuccess = false;
      state.editEnquiryState.isFetching = false;
      state.editEnquiryState.result = '';
      return state;
    },
  },
  extraReducers: builder => {
    builder.addCase(setEditEnquiryDb.pending, state => {
      state.editEnquiryState.isFetching = true;
    });
    builder.addCase(setEditEnquiryDb.fulfilled, (state, action) => {
      state.editEnquiryState.isFetching = false;
      state.editEnquiryState.isSuccess = true;
      state.editEnquiryState.result = action.payload;
    });
    builder.addCase(setEditEnquiryDb.rejected, (state, action) => {
      state.editEnquiryState.isFetching = false;
      state.editEnquiryState.isError = true;
    });
  },
});
export const {clearEditEnquiryState} = editEnquirySlice.actions;
export default editEnquirySlice.reducer;
