import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    editemployeeSliceState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        message: '',
    },
    editemployeeData: {
        data: null
    }
}

// export const setEditemployeeData = async (data) => {
//     console.log('in setEditemployeeData ', data)
// }


export const editemployeeUpdateToDb = createAsyncThunk('editemployeeUpdateToDb/editemployeeSlice', async (employeeData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/employees/edit-employee`
    return await Axios.post(url, employeeData,config).then((response) => {
        return response.data
    })
})
const editemployeeSlice = createSlice({
    name: 'editemployeeSliceState',
    initialState,

    reducers: {
        setEditemployeeData: (state, action) => {
            state.editemployeeData.data = action.payload;
        },
        clearEditemployeeState: (state) => {
            state.editemployeeSliceState.isError = false;
            state.editemployeeSliceState.isSuccess = false;
            state.editemployeeSliceState.isFetching = false;
            state.editemployeeSliceState.message = '';
            return state;
        },
        clearEditemployeeData: (state) => {
            state.editemployeeData.data = null;
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(editemployeeUpdateToDb.pending, state => {
            state.editemployeeSliceState.isFetching = true;
        })
        builder.addCase(editemployeeUpdateToDb.fulfilled, (state, action) => {
            state.editemployeeSliceState.isFetching = false;
            state.editemployeeSliceState.isSuccess = true;
            state.editemployeeSliceState.message = action.payload;
        })
        builder.addCase(editemployeeUpdateToDb.rejected, (state, action) => {
            state.editemployeeSliceState.isFetching = false;
            state.editemployeeSliceState.isError = true;
        })
    }
})
export const { clearEditemployeeState, setEditemployeeData, clearEditemployeeData } = editemployeeSlice.actions;
export default editemployeeSlice.reducer

