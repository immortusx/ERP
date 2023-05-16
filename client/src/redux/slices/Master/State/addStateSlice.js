import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    addState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        message: '',
    },

}


export const addStateToDb = createAsyncThunk('addStateToDb/addStateSlice', async (stateData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    console.log('in addUserSlice', stateData)
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/add-state`
    return await Axios.post(url, stateData,config).then((response) => {
        return response.data
    })
})
const addStateSlice = createSlice({
    name: 'addState',
    initialState,
    reducers: {
        clearAddState: (state) => {
            state.addState.isError = false;
            state.addState.isSuccess = false;
            state.addState.isFetching = false;
            state.addState.message = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(addStateToDb.pending, state => {
            state.addState.isFetching = true;
        })
        builder.addCase(addStateToDb.fulfilled, (state, action) => {
            state.addState.isFetching = false;
            state.addState.isSuccess = true;
            state.addState.message = action.payload;
        })
        builder.addCase(addStateToDb.rejected, (state, action) => {
            state.addState.isFetching = false;
            state.addState.isError = true;
        })
    }
})
export const { clearAddState } = addStateSlice.actions;
export default addStateSlice.reducer

