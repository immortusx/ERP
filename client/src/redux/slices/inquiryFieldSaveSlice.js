import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    inquiryFieldSaveState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        result: '',
    },

}

export const inquiryFieldSaveDB = createAsyncThunk('inquiryFieldSaveDB/inquiryFieldSave', async (data) => {
    console.log('inquiryFieldSaveDB called data', data);
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/categoryInsertFields`
    return await Axios.post(url, data, config).then((response) => {
        console.log('response.data', response.data)
        return response.data
    })
})
const inquiryFieldSaveSlice = createSlice({
    name: 'inquiryFieldSaveState',
    initialState,
    reducers: {
        clearAdminState: (state) => {
            state.inquiryFieldSaveState.isError = false;
            state.inquiryFieldSaveState.isSuccess = false;
            state.inquiryFieldSaveState.isFetching = false;
            state.inquiryFieldSaveState.result = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(inquiryFieldSaveDB.pending, state => {
            state.inquiryFieldSaveState.isFetching = true;
        })
        builder.addCase(inquiryFieldSaveDB.fulfilled, (state, action) => {
            state.inquiryFieldSaveState.isFetching = false;
            state.inquiryFieldSaveState.isSuccess = true;
            state.inquiryFieldSaveState.result = action.payload;
        })
        builder.addCase(inquiryFieldSaveDB.rejected, (state, action) => {
            state.inquiryFieldSaveState.isFetching = false;
            state.inquiryFieldSaveState.isError = true;
        })
    }
})
export const { clearAdminState } = inquiryFieldSaveSlice.actions;
export default inquiryFieldSaveSlice.reducer

