import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    employeeListState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        list: [],
    },

}

export const getemployeeListFromDb = createAsyncThunk('getemployeeListFromDb/getemployeeListSlice', async (employeeData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/employees/get-employee-list`
    return await Axios.get(url, config).then((response) => {
        return response.data
    })
})
const getemployeeListSlice = createSlice({
    name: 'employeeListState',
    initialState,
    reducers: {
        clearemployeeListState: (state) => {
            state.employeeListState.isError = false;
            state.employeeListState.isSuccess = false;
            state.employeeListState.isFetching = false;
            state.employeeListState.list = [];
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(getemployeeListFromDb.pending, state => {
            state.employeeListState.isFetching = true;
        })
        builder.addCase(getemployeeListFromDb.fulfilled, (state, action) => {
            state.employeeListState.isFetching = false;
            state.employeeListState.isSuccess = true;
            state.employeeListState.list = action.payload;
        })
        builder.addCase(getemployeeListFromDb.rejected, (state, action) => {
            state.employeeListState.isFetching = false;
            state.employeeListState.isError = true;
        })
    }
})
export const { clearemployeeListState } = getemployeeListSlice.actions;
export default getemployeeListSlice.reducer

