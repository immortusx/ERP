import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    editRoleSliceState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        message: '',
    },
}




export const editRoleToDb = createAsyncThunk('editRoleToDb/editRoleDataSlice', async (myData) => {
    console.log('calleddd');
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    console.log('in editRoleToDb',myData)
    const url = `${process.env.REACT_APP_NODE_URL}/api/roles/edit-role`
    return await Axios.post(url, myData,config).then((response) => {
        return response.data
    }) 
})
const editRoleDataSlice = createSlice({
    name: 'editRoleSliceState',
    initialState,

    reducers: {
        clearEditRoleState: (state) => {
            state.editRoleSliceState.isError = false;
            state.editRoleSliceState.isSuccess = false;
            state.editRoleSliceState.isFetching = false;
            state.editRoleSliceState.message = '';
            return state;
        }
    },
    extraReducers: builder => {
        builder.addCase(editRoleToDb.pending, state => {
            state.editRoleSliceState.isFetching = true;
        })
        builder.addCase(editRoleToDb.fulfilled, (state, action) => {
            state.editRoleSliceState.isFetching = false;
            state.editRoleSliceState.isSuccess = true;
            state.editRoleSliceState.message = action.payload;
        })
        builder.addCase(editRoleToDb.rejected, (state, action) => {
            state.editRoleSliceState.isFetching = false;
            state.editRoleSliceState.isError = true;
        })
    }
})
export const { clearEditRoleState } = editRoleDataSlice.actions;
export default editRoleDataSlice.reducer

