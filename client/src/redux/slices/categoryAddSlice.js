import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    categoryAddSliceState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        result: '',
    },

}

export const categoryAddToDB = createAsyncThunk('categoryAddToDB/categoryAddSlice', async (data) => {
    console.log('categoryAddToDB called data', data);
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/addInquiryCategory`
    return await Axios.post(url, data, config).then((response) => {
        console.log('response.data', response.data)
        return response.data
    })
})
const categoryAddSlice = createSlice({
    name: 'categoryAddSliceState',
    initialState,
    reducers: {
        clearCategoryAddState: (state) => {
            state.categoryAddSliceState.isError = false;
            state.categoryAddSliceState.isSuccess = false;
            state.categoryAddSliceState.isFetching = false;
            state.categoryAddSliceState.result = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(categoryAddToDB.pending, state => {
            state.categoryAddSliceState.isFetching = true;
        })
        builder.addCase(categoryAddToDB.fulfilled, (state, action) => {
            state.categoryAddSliceState.isFetching = false;
            state.categoryAddSliceState.isSuccess = true;
            state.categoryAddSliceState.result = action.payload;
        })
        builder.addCase(categoryAddToDB.rejected, (state, action) => {
            state.categoryAddSliceState.isFetching = false;
            state.categoryAddSliceState.isError = true;
        })
    }
})
export const { clearAdminState, clearCategoryAddState } = categoryAddSlice.actions;
export default categoryAddSlice.reducer

