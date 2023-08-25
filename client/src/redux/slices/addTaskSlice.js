import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    addTaskState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        result: '',
    },
}

export const addTaskToDb = createAsyncThunk('addTaskToDb/addTaskSlice', async (data) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/addtask-data`;
    await axios.post(url, data, config).then((response) => {
        if (response) {
            console.log(response.data.isSuccess);
        }
    })
});

const addTaskSlice = createSlice({
    name: 'addTaskState',
    initialState,
    reducers: {
        clearAddTaskState: (state) => {
            state.addTaskState.isError = false;
            state.addTaskState.isSuccess = false;
            state.addTaskState.isFetching = false;
            state.addTaskState.result = '';
          
        },
    },
    extraReducers: builder => {
        builder.addCase(addTaskToDb.pending, state => {
            state.addTaskState.isFetching = true;
        });
        builder.addCase(addTaskToDb.fulfilled, (state, action) => {
            state.addTaskState.isFetching = false;
            state.addTaskState.isSuccess = true;
            state.addTaskState.result = action.payload;
        });
        builder.addCase(addTaskToDb.rejected, (state, action) => {
            state.addTaskState.isFetching = false;
            state.addTaskState.isError = true;
        });
    }
});

export const { clearAddTaskState } = addTaskSlice.actions;
export default addTaskSlice.reducer;
