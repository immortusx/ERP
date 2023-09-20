import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    addEnquirySourcesState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        message: '',
    },

}


export const addEnquirySourcesToDb = createAsyncThunk('addEnquirySourcesToDb/addEnquirySourcesSlice', async (enquirySourcesData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    console.log('in addUserSlice', enquirySourcesData)
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/add-primary-sources`
    return await Axios.post(url, enquirySourcesData,config).then((response) => {
        return response.data
    })
})
const addEnquirySourcesSlice = createSlice({
    name: 'addEnquirySourcesState',
    initialState,
    reducers: {
        clearAddEnquirySources: (state) => {
            state.addEnquirySourcesState.isError = false;
            state.addEnquirySourcesState.isSuccess = false;
            state.addEnquirySourcesState.isFetching = false;
            state.addEnquirySourcesState.message = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(addEnquirySourcesToDb.pending, state => {
            state.addEnquirySourcesState.isFetching = true;
        })
        builder.addCase(addEnquirySourcesToDb.fulfilled, (state, action) => {
            state.addEnquirySourcesState.isFetching = false;
            state.addEnquirySourcesState.isSuccess = true;
            state.addEnquirySourcesState.message = action.payload;
        })
        builder.addCase(addEnquirySourcesToDb.rejected, (state, action) => {
            state.addEnquirySourcesState.isFetching = false;
            state.addEnquirySourcesState.isError = true;
        })
    }
})
export const { clearAddEnquirySources } = addEnquirySourcesSlice.actions;
export default addEnquirySourcesSlice.reducer

