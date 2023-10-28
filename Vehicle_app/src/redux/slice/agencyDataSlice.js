import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  agencyDataState: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    result: null, // Modify the result to be an object
  },
};

export const agencyDb = createAsyncThunk('agencyDb/agencySlice', async () => {
  const url = `${API_URL}/api/get-agencylogo`; // Use the correct endpoint
  const token = await AsyncStorage.getItem('rbacToken');
  const config = {
    headers: {
      token: token ? token : '',
    },
  };

  try {
    const response = await axios.get(url,config);
    console.log(response.data,"%%%%%%%%%%%%%%%%%%%%%%%%");
    return response.data; // Return the data directly
  } catch (error) {
    throw error;
  }
});

const agencyDataSlice = createSlice({
  name: 'agencyDataState',
  initialState,
  reducers: {
    clearagencyDataState: state => {
      state.agencyDataState.isError = false;
      state.agencyDataState.isSuccess = false;
      state.agencyDataState.isFetching = false;
      state.agencyDataState.result = null; // Modify result to be null
    },
  },
  extraReducers: builder => {
    builder.addCase(agencyDb.pending, state => {
      state.agencyDataState.isFetching = true;
    });
    builder.addCase(agencyDb.fulfilled, (state, action) => {
      state.agencyDataState.isFetching = false;
      state.agencyDataState.isSuccess = true;
      state.agencyDataState.result = action.payload;
    });
    builder.addCase(agencyDb.rejected, (state, action) => {
      state.agencyDataState.isFetching = false;
      state.agencyDataState.isError = true;
    });
  },
});

export const {clearagencyDataState} = agencyDataSlice.actions;
export default agencyDataSlice.reducer;
