import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    enquiryFieldSaveState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        result: '',
    },

}

export const enquiryFieldSaveDB = createAsyncThunk('enquiryFieldSaveDB/enquiryFieldSave', async (data) => {
    console.log('enquiryFieldSaveDB called data', data);
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/category-insert-fields`
    return await Axios.post(url, data, config).then((response) => {
        console.log('response.data', response.data)
        return response.data
    })
})
const enquiryFieldSaveSlice = createSlice({
    name: 'enquiryFieldSaveState',
    initialState,
    reducers: {
        clearAdminState: (state) => {
            state.enquiryFieldSaveState.isError = false;
            state.enquiryFieldSaveState.isSuccess = false;
            state.enquiryFieldSaveState.isFetching = false;
            state.enquiryFieldSaveState.result = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(enquiryFieldSaveDB.pending, state => {
            state.enquiryFieldSaveState.isFetching = true;
        })
        builder.addCase(enquiryFieldSaveDB.fulfilled, (state, action) => {
            state.enquiryFieldSaveState.isFetching = false;
            state.enquiryFieldSaveState.isSuccess = true;
            state.enquiryFieldSaveState.result = action.payload;
        })
        builder.addCase(enquiryFieldSaveDB.rejected, (state, action) => {
            state.enquiryFieldSaveState.isFetching = false;
            state.enquiryFieldSaveState.isError = true;
        })
    }
})
export const { clearAdminState } = enquiryFieldSaveSlice.actions;
export default enquiryFieldSaveSlice.reducer

