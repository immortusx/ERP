import axios from 'axios';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

const initialState = {
  followUpState: {
    isFetching: false,
    isSuccess: false,
    isError: false,
    result: '',
  },
};

export const setFollowUpDb = createAsyncThunk(
  'setFollowUpDb/addFollowUpSlice',
  async data => {
    console.log(data, 'addFollowUp');
    const url = `${API_URL}/api/enquiry/set-follow-up`;
    console.log(url, 'add followUp Details');
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    console.log(config);
    return await axios.post(url, data, config).then(response => {
      if (response) {
        console.log(response.data, 'follow up....');
        return response.data;
      }
    });
  },
);

const followUpSlice = createSlice({
  name: 'followUpState',
  initialState,
  reducers: {
    clearFollowUpState: state => {
      state.followUpState.isFetching = false;
      state.followUpState.isSuccess = false;
      state.followUpState.isError = false;
      state.followUpState.result = '';
      return state;
    },
  },
  extraReducers: builder => {
    builder.addCase(setFollowUpDb.pending, state => {
      state.followUpState.isFetching = true;
      state.followUpState.isError = false;
    });
    builder.addCase(setFollowUpDb.fulfilled, (state, action) => {
      state.followUpState.isFetching = false;
      state.followUpState.isError = false;
      state.followUpState.isSuccess = true;
      state.followUpState.result = action.payload;
    });
    builder.addCase(setFollowUpDb.rejected, (state, action) => {
      state.followUpState.isFetching = false;
      state.followUpState.isError = true;
    });
  },
});

export const {clearFollowUpState} = followUpSlice.actions;
export default followUpSlice.reducer;
