import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    inquiryState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        result: '',
    },

}

export const setInquiryDb = createAsyncThunk('setInquiryDb/inquirySlice', async (data) => {
    console.log('data', data)
    const url = `${process.env.REACT_APP_NODE_URL}/api/setInquiryDb`
    // return await Axios.get(url).then((response) => {
    //     return response.data
    // })
})
const inquirySlice = createSlice({
    name: 'inquiryState',
    initialState,
    reducers: {
        clearInquiryState: (state) => {
            state.inquiryState.isError = false;
            state.inquiryState.isSuccess = false;
            state.inquiryState.isFetching = false;
            state.inquiryState.result = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(setInquiryDb.pending, state => {
            state.inquiryState.isFetching = true;
        })
        builder.addCase(setInquiryDb.fulfilled, (state, action) => {
            state.inquiryState.isFetching = false;
            state.inquiryState.isSuccess = true;
            state.inquiryState.result = action.payload;
        })
        builder.addCase(setInquiryDb.rejected, (state, action) => {
            state.inquiryState.isFetching = false;
            state.inquiryState.isError = true;
        })
    }
})
export const { clearInquiryState } = inquirySlice.actions;
export default inquirySlice.reducer

