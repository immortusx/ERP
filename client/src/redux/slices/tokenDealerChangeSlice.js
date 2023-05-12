import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    tokenDealerState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        data: {},
    },
}




export const tokenDealerChangeDb = createAsyncThunk('tokenDealerChangeDb/tokenDealerChangeSlice', async (myData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/login/dealer-token-change`
    return await Axios.post(url, { id: myData }, config).then((response) => {
        return response.data
    })
})
const tokenDealerChangeSlice = createSlice({
    name: 'tokenDealerState',
    initialState,

    reducers: {
        clearTokenDealerState: (state) => {
            state.tokenDealerState.isError = false;
            state.tokenDealerState.isSuccess = false;
            state.tokenDealerState.isFetching = false;
            state.tokenDealerState.data = {};
            return state;
        }
    },
    extraReducers: builder => {
        builder.addCase(tokenDealerChangeDb.pending, state => {
            state.tokenDealerState.isFetching = true;
        })
        builder.addCase(tokenDealerChangeDb.fulfilled, (state, action) => {
            state.tokenDealerState.isFetching = false;
            state.tokenDealerState.isSuccess = true;
            state.tokenDealerState.data = action.payload;
        })
        builder.addCase(tokenDealerChangeDb.rejected, (state, action) => {
            state.tokenDealerState.isFetching = false;
            state.tokenDealerState.isError = true;
        })
    }
})
export const { clearTokenDealerState } = tokenDealerChangeSlice.actions;
export default tokenDealerChangeSlice.reducer

