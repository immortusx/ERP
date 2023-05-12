import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    addUserState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        message: '',
    },

}


export const addUserToDb = createAsyncThunk('addUserToDb/addUserSlice', async (userData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    console.log('in addUserSlice', userData)
    const url = `${process.env.REACT_APP_NODE_URL}/api/users/add-user`
    return await Axios.post(url, userData,config).then((response) => {
        return response.data
    })
})
const addUserSlice = createSlice({
    name: 'addUserState',
    initialState,
    reducers: {
        clearAddUserState: (state) => {
            state.addUserState.isError = false;
            state.addUserState.isSuccess = false;
            state.addUserState.isFetching = false;
            state.addUserState.message = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(addUserToDb.pending, state => {
            state.addUserState.isFetching = true;
        })
        builder.addCase(addUserToDb.fulfilled, (state, action) => {
            state.addUserState.isFetching = false;
            state.addUserState.isSuccess = true;
            state.addUserState.message = action.payload;
        })
        builder.addCase(addUserToDb.rejected, (state, action) => {
            state.addUserState.isFetching = false;
            state.addUserState.isError = true;
        })
    }
})
export const { clearAddUserState } = addUserSlice.actions;
export default addUserSlice.reducer

