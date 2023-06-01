import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    addManufacturer: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        message: '',
    },

}


export const addManufacturerToDb = createAsyncThunk('addManufacturerToDb/addManufacturerSlice', async (manufacturerData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    console.log('in addUserSlice', manufacturerData)
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/add-manufacturer`
    return await Axios.post(url, manufacturerData,config).then((response) => {
        return response.data
    })
})
const addManufacturerSlice = createSlice({
    name: 'addManufacturer',
    initialState,
    reducers: {
        clearAddManufacturer: (state) => {
            state.addManufacturer.isError = false;
            state.addManufacturer.isSuccess = false;
            state.addManufacturer.isFetching = false;
            state.addManufacturer.message = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(addManufacturerToDb.pending, state => {
            state.addManufacturer.isFetching = true;
        })
        builder.addCase(addManufacturerToDb.fulfilled, (state, action) => {
            state.addManufacturer.isFetching = false;
            state.addManufacturer.isSuccess = true;
            state.addManufacturer.message = action.payload;
        })
        builder.addCase(addManufacturerToDb.rejected, (state, action) => {
            state.addManufacturer.isFetching = false;
            state.addManufacturer.isError = true;
        })
    }
})
export const { clearAddManufacturer } = addManufacturerSlice.actions;
export default addManufacturerSlice.reducer

