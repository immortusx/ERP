import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    adminExist: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        result: '',
    },

}

export const isAdminExist = createAsyncThunk('isAdminExist/AdminSlice', async () => {
    const url = `${process.env.REACT_APP_NODE_URL}/api/adminExist`
    return await Axios.get(url).then((response) => {
        return response.data
    })
})
const AdminSlice = createSlice({
    name: 'adminExist',
    initialState,
    reducers: {
        clearAdminState: (state) => {
            state.adminExist.isError = false;
            state.adminExist.isSuccess = false;
            state.adminExist.isFetching = false;
            state.adminExist.result = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(isAdminExist.pending, state => {
            state.adminExist.isFetching = true;
        })
        builder.addCase(isAdminExist.fulfilled, (state, action) => {
            state.adminExist.isFetching = false;
            state.adminExist.isSuccess = true;
            state.adminExist.result = action.payload;
        })
        builder.addCase(isAdminExist.rejected, (state, action) => {
            state.adminExist.isFetching = false;
            state.adminExist.isError = true;
        })
    }
})
export const { clearAdminState } = AdminSlice.actions;
export default AdminSlice.reducer

