import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../config';
import { API_URL } from '@env';

const initialState = {
    enquiryState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        result: '',
    },

}

export const setEnquiryDb = createAsyncThunk('setEnquiryDb/enquirySlice', async (data) => {
    console.log('data', data)
    const url = `${API_URL}/api/setEnquiryDb`
    // const url = `${config.API_URL}/api/setEnquiryDb`
    // return await Axios.get(url).then((response) => {
    //     return response.data
    // })
})
const enquirySlice = createSlice({
    name: 'enquiryState',
    initialState,
    reducers: {
        clearEnquiryState: (state) => {
            state.enquiryState.isError = false;
            state.enquiryState.isSuccess = false;
            state.enquiryState.isFetching = false;
            state.enquiryState.result = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(setEnquiryDb.pending, state => {
            state.enquiryState.isFetching = true;
        })
        builder.addCase(setEnquiryDb.fulfilled, (state, action) => {
            state.enquiryState.isFetching = false;
            state.enquiryState.isSuccess = true;
            state.enquiryState.result = action.payload;
        })
        builder.addCase(setEnquiryDb.rejected, (state, action) => {
            state.enquiryState.isFetching = false;
            state.enquiryState.isError = true;
        })
    }
})
export const { clearEnquiryState } = enquirySlice.actions;
export default enquirySlice.reducer

