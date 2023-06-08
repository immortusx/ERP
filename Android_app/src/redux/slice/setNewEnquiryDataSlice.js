import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../../config";
import { API_URL } from '@env';

const initialState = {
    newEnquiryState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        data: {},
    },

}

export const setNewEnquiryDataDb = createAsyncThunk('setNewEnquiryDataDb/setNewEnquiryDataSlice', async (userData) => {
    const conf = {
        headers: {
            token: AsyncStorage.getItem('rbacToken')
        }
    };
    const url = `${API_URL}/api/enquiry/set-new-enquiry-data`
    // const url = `${config.API_URL}/api/enquiry/set-new-enquiry-data`
    return await Axios.post(url, userData, conf).then((response) => {
        console.log(userData,"user Data")
        return response.data
    })
})
const setNewEnquiryDataSlice = createSlice({
    name: 'newEnquiryState',
    initialState,
    reducers: {
        clearNewEnquiryState: (state) => {
            state.newEnquiryState.isError = false;
            state.newEnquiryState.isSuccess = false;
            state.newEnquiryState.isFetching = false;
            state.newEnquiryState.data = {};
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(setNewEnquiryDataDb.pending, state => {
            state.newEnquiryState.isFetching = true;
        })
        builder.addCase(setNewEnquiryDataDb.fulfilled, (state, action) => {
            state.newEnquiryState.isFetching = false;
            state.newEnquiryState.isSuccess = true;
            state.newEnquiryState.data = action.payload;
        })
        builder.addCase(setNewEnquiryDataDb.rejected, (state, action) => {
            state.newEnquiryState.isFetching = false;
            state.newEnquiryState.isError = true;
        })
    }
})
export const { clearNewEnquiryState } = setNewEnquiryDataSlice.actions;
export default setNewEnquiryDataSlice.reducer

