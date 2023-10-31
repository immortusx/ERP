import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

const initialState = {
  agencyDataState: {
    isSuccess: false,
    isFetching: false,
    isError: false,
    result: null,
  },
};

export const getAgencyData = createAsyncThunk(
  'getAgencyData/getAgencySlice',
  async () => {
    const url = `${API_URL}/api/agency/get-agencylogo`;
    console.log(url, 'agencyData');
    try {
      const token = await AsyncStorage.getItem('rbacToken');
      const config = {
        headers: {
          token: token || '',
        },
      };
      const response = await axios.get(url, config);
      console.log(response.data.result, 'agencyData');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);
const getAgencySlice = createSlice({
  name: 'agencyDataState',
  initialState,
  reducers: {
    clearAgencyDataState: state => {
      (state.agencyDataState.isError = false),
        (state.agencyDataState.isFetching = false),
        (state.agencyDataState.isSuccess = false),
        (state.agencyDataState.result = null);
    },
  },
  extraReducers: builder => {
    builder.addCase(getAgencyData.pending, state => {
      (state.agencyDataState.isFetching = true),
        (state.agencyDataState.isError = false);
    });
    builder.addCase(getAgencyData.fulfilled, (state, action) => {
      (state.agencyDataState.isFetching = false),
        (state.agencyDataState.isError = false),
        (state.agencyDataState.isSuccess = true),
        (state.agencyDataState.result = action.payload);
    });
    builder.addCase(getAgencyData.rejected, state => {
      (state.agencyDataState.isError = true),
        (state.agencyDataState.isFetching = false);
    });
  },
});

export const {clearAgencyDataState} = getAgencySlice.actions;
export default getAgencySlice.reducer;
