import axios from 'axios';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { API_URL } from "@env"
const initialState = {
    loginState: {
        isFetching: false,
        isSuccess: false,
        isError: false,
        result: ''
    }
}

 export const getLoginUser = createAsyncThunk('getLoginUser/getLoginSlice', async(data)=> {
    console.log(data);
    const url = `${API_URL}/api/login`
   console.log('getLoginUser', url);
   return await axios.post(url, data).then((response)=> {
    return response.data
   })
 })

 const getLoginSlice = createSlice({
    name: 'loginState',
    initialState,
    reducers: {
        clearLoginState: (state)=> {
            state.loginState.isError = false;
            state.loginState.isSuccess =false;
            state.loginState.isFetching = false;
            state.loginState.result = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(getLoginUser.pending, state => {
            state.loginState.isFetching = true;
        })
        builder.addCase(getLoginUser.fulfilled, (state, action)=> {
            state.loginState.isFetching = false;
            state.loginState.isSuccess = true;
            state.loginState.result = action.payload;
        })
        builder.addCase(getLoginUser.rejected, (state)=> {
            state.loginState.isFetching = false;
            state.loginState.isError = true;
        })
    }
 })
 export const {clearLoginState} =getLoginSlice.actions;
 export default getLoginSlice.reducer

