import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    newInquiryState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        data: {},
    },

}

export const setNewInquiryDataDb = createAsyncThunk('setNewInquiryDataDb/setNewInquiryDataSlice', async (userData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/set-new-inquiry-data`
    return await Axios.post(url, userData, config).then((response) => {
        return response.data
    })
})
const setNewInquiryDataSlice = createSlice({
    name: 'newInquiryState',
    initialState,
    reducers: {
        clearNewInquiryState: (state) => {
            state.newInquiryState.isError = false;
            state.newInquiryState.isSuccess = false;
            state.newInquiryState.isFetching = false;
            state.newInquiryState.data = {};
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(setNewInquiryDataDb.pending, state => {
            state.newInquiryState.isFetching = true;
        })
        builder.addCase(setNewInquiryDataDb.fulfilled, (state, action) => {
            state.newInquiryState.isFetching = false;
            state.newInquiryState.isSuccess = true;
            state.newInquiryState.data = action.payload;
        })
        builder.addCase(setNewInquiryDataDb.rejected, (state, action) => {
            state.newInquiryState.isFetching = false;
            state.newInquiryState.isError = true;
        })
    }
})
export const { clearNewInquiryState } = setNewInquiryDataSlice.actions;
export default setNewInquiryDataSlice.reducer

