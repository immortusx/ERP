import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    addEnquirySources: {
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
    name: 'addEnquirySources',
    initialState,
    reducers: {
        clearAddManufacturer: (state) => {
            state.addEnquirySources.isError = false;
            state.addEnquirySources.isSuccess = false;
            state.addEnquirySources.isFetching = false;
            state.addEnquirySources.message = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(addEnquirySourcesToDb.pending, state => {
            state.addEnquirySources.isFetching = true;
        })
        builder.addCase(addEnquirySourcesToDb.fulfilled, (state, action) => {
            state.addManufacturer.isFetching = false;
            state.addManufacturer.isSuccess = true;
            state.addManufacturer.message = action.payload;
        })
        builder.addCase(addEnquirySourcesToDb.rejected, (state, action) => {
            state.addManufacturer.isFetching = false;
            state.addManufacturer.isError = true;
        })
    }
})
export const { clearAddEnquirySources } = addEnquirySourcesSlice.actions;
export default addEnquirySourcesSlice.reducer

