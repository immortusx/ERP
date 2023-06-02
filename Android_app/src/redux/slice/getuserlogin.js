import axios from "axios";
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config";
import { API_URL } from '@env';

const initialState = {
    loginState: {
      isSuccess: false,
      isError: false,
      isFetching: false,
      result: '',
    },
  
  }


  export const getLoginUser = createAsyncThunk('getLoginUser/getLoginSlice', async (data) => {
    const url = `${API_URL}/api/login`
    // const url = `${config.API_URL}/api/login`
    return await axios.post(url, data).then((response) => {
      return response.data
    })
  })


  const getLoginSlice = createSlice({
    name: 'loginState',
    initialState,
    reducers: {
      clearLoginState: (state) => {
        state.loginState.isError = false;
        state.loginState.isSuccess = false;
        state.loginState.isFetching = false;
        state.loginState.result = '';
        return state;
      },
    },

    extraReducers: builder => {
        builder.addCase(getLoginUser.pending, state => {
          state.loginState.isFetching = true;
        })
        builder.addCase(getLoginUser.fulfilled, (state, action) => {
          state.loginState.isFetching = false;
          state.loginState.isSuccess = true;
          state.loginState.result = action.payload;
        })
        builder.addCase(getLoginUser.rejected, (state, action) => {
          state.loginState.isFetching = false;
          state.loginState.isError = true;
        })
      }
    })

    export const { clearLoginState } = getLoginSlice.actions;
export default getLoginSlice.reducer