import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    addemployeeState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        message: '',
    },

}


export const addemployeeToDb = createAsyncThunk('addemployeeToDb/addemployeeSlice', async (employeeData,selectedDate,bloodgroup,BankDetais) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    console.log('in addemployeeSlice', employeeData,selectedDate,bloodgroup,BankDetais)
    const url = `${process.env.REACT_APP_NODE_URL}/api/employees/add-employee`
    return await Axios.post(url, employeeData,config).then((response) => {
        return response.data
    })
})
const addemployeeSlice = createSlice({
    name: 'addemployeeState',
    initialState,
    reducers: {
        clearAddemployeeState: (state) => {
            state.addemployeeState.isError = false;
            state.addemployeeState.isSuccess = false;
            state.addemployeeState.isFetching = false;
            state.addemployeeState.message = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(addemployeeToDb.pending, state => {
            state.addemployeeState.isFetching = true;
        })
        builder.addCase(addemployeeToDb.fulfilled, (state, action) => {
            state.addemployeeState.isFetching = false;
            state.addemployeeState.isSuccess = true;
            state.addemployeeState.message = action.payload;
        })
        builder.addCase(addemployeeToDb.rejected, (state, action) => {
            state.addemployeeState.isFetching = false;
            state.addemployeeState.isError = true;
        })
    }
})
export const { clearAddemployeeState } = addemployeeSlice.actions;
export default addemployeeSlice.reducer

