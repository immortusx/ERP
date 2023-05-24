import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    tokenBranchState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        data: {},
    },
}




export const tokenBranchChangeDb = createAsyncThunk('tokenBranchChangeDb/tokenBranchChangeSlice', async (myData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/login/branch-token-change`
    return await Axios.post(url, { id: myData }, config).then((response) => {
        return response.data
    })
})
const tokenBranchChangeSlice = createSlice({
    name: 'tokenBranchState',
    initialState,

    reducers: {
        clearTokenBranchState: (state) => {
            state.tokenBranchState.isError = false;
            state.tokenBranchState.isSuccess = false;
            state.tokenBranchState.isFetching = false;
            state.tokenBranchState.data = {};
            return state;
        }
    },
    extraReducers: builder => {
        builder.addCase(tokenBranchChangeDb.pending, state => {
            state.tokenBranchState.isFetching = true;
        })
        builder.addCase(tokenBranchChangeDb.fulfilled, (state, action) => {
            state.tokenBranchState.isFetching = false;
            state.tokenBranchState.isSuccess = true;
            state.tokenBranchState.data = action.payload;
        })
        builder.addCase(tokenBranchChangeDb.rejected, (state, action) => {
            state.tokenBranchState.isFetching = false;
            state.tokenBranchState.isError = true;
        })
    }
})
export const { clearTokenBranchState } = tokenBranchChangeSlice.actions;
export default tokenBranchChangeSlice.reducer

