
import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    addRoleState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        message: '',
    },

}

export const addRoleToDb = createAsyncThunk('addRoleToDb/addRoleSlice', async (data) => {
    console.log('in addRoleSlice', data)
    const url = `${process.env.REACT_APP_NODE_URL}/api/add-role`
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        },
    };
    return await Axios.post(url, data, config).then((response) => {
        return response.data
    })
})
const addRoleSlice = createSlice({
    name: 'addRoleState',
    initialState,
    reducers: {
        clearAddRoleState: (state) => {
            state.addRoleState.isError = false;
            state.addRoleState.isSuccess = false;
            state.addRoleState.isFetching = false;
            state.addRoleState.message = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(addRoleToDb.pending, state => {
            state.addRoleState.isFetching = true;
        })
        builder.addCase(addRoleToDb.fulfilled, (state, action) => {
            state.addRoleState.isFetching = false;
            state.addRoleState.isSuccess = true;
            state.addRoleState.message = action.payload;
        })
        builder.addCase(addRoleToDb.rejected, (state, action) => {
            state.addRoleState.isFetching = false;
            state.addRoleState.isError = true;
        })
    }
})
export const { clearAddRoleState } = addRoleSlice.actions;
export default addRoleSlice.reducer

