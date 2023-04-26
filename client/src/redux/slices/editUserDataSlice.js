import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    editUserSliceState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        message: '',
    },
    editUserData: {
        data: null
    }
}

// export const setEditUserData = async (data) => {
//     console.log('in setEditUserData ', data)
// }


export const editUserUpdateToDb = createAsyncThunk('editUserUpdateToDb/editUserSlice', async (userData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/users/edit-user`
    return await Axios.post(url, userData,config).then((response) => {
        return response.data
    })
})
const editUserSlice = createSlice({
    name: 'editUserSliceState',
    initialState,

    reducers: {
        setEditUserData: (state, action) => {
            state.editUserData.data = action.payload;
        },
        clearEditUserState: (state) => {
            state.editUserSliceState.isError = false;
            state.editUserSliceState.isSuccess = false;
            state.editUserSliceState.isFetching = false;
            state.editUserSliceState.message = '';
            return state;
        },
        clearEditUserData: (state) => {
            state.editUserData.data = null;
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(editUserUpdateToDb.pending, state => {
            state.editUserSliceState.isFetching = true;
        })
        builder.addCase(editUserUpdateToDb.fulfilled, (state, action) => {
            state.editUserSliceState.isFetching = false;
            state.editUserSliceState.isSuccess = true;
            state.editUserSliceState.message = action.payload;
        })
        builder.addCase(editUserUpdateToDb.rejected, (state, action) => {
            state.editUserSliceState.isFetching = false;
            state.editUserSliceState.isError = true;
        })
    }
})
export const { clearEditUserState, setEditUserData, clearEditUserData } = editUserSlice.actions;
export default editUserSlice.reducer

