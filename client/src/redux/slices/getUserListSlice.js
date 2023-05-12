import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    userListState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        list: [],
    },

}

export const getUserListFromDb = createAsyncThunk('getUserListFromDb/getUserListSlice', async (userData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/users/get-user-list`
    return await Axios.get(url, config).then((response) => {
        return response.data
    })
})
const getUserListSlice = createSlice({
    name: 'userListState',
    initialState,
    reducers: {
        clearUserListState: (state) => {
            state.userListState.isError = false;
            state.userListState.isSuccess = false;
            state.userListState.isFetching = false;
            state.userListState.list = [];
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(getUserListFromDb.pending, state => {
            state.userListState.isFetching = true;
        })
        builder.addCase(getUserListFromDb.fulfilled, (state, action) => {
            state.userListState.isFetching = false;
            state.userListState.isSuccess = true;
            state.userListState.list = action.payload;
        })
        builder.addCase(getUserListFromDb.rejected, (state, action) => {
            state.userListState.isFetching = false;
            state.userListState.isError = true;
        })
    }
})
export const { clearUserListState } = getUserListSlice.actions;
export default getUserListSlice.reducer

