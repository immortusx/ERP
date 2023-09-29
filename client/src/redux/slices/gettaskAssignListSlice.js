import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const initialState = {
    taskAssignListState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        list: [],
    },

}

export const gettaskAssignListFromDb = createAsyncThunk('gettaskAssignListFromDb/gettaskAssignListSlice', async (taskAssignData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/get-task-list`
    return await Axios.get(url, config).then((response) => {
        return response.data
    })
})
const gettaskAssignListSlice = createSlice({
    name: 'taskAssignListState',
    initialState,
    reducers: {
        cleartaskAssignListState: (state) => {
            state.taskAssignListState.isError = false;
            state.taskAssignListState.isSuccess = false;
            state.taskAssignListState.isFetching = false;
            state.taskAssignListState.list = [];
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(gettaskAssignListFromDb.pending, state => {
            state.taskAssignListState.isFetching = true;
        })
        builder.addCase(gettaskAssignListFromDb.fulfilled, (state, action) => {
            state.taskAssignListState.isFetching = false;
            state.taskAssignListState.isSuccess = true;
            state.taskAssignListState.list = action.payload;
        })
        builder.addCase(gettaskAssignListFromDb.rejected, (state, action) => {
            state.taskAssignListState.isFetching = false;
            state.taskAssignListState.isError = true;
        })
    }
})
export const { cleartaskAssignListState } = gettaskAssignListSlice.actions;
export default gettaskAssignListSlice.reducer

