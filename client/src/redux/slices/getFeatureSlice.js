
import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    featuresState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        data: '',
    },

}

export const getFeatureFromDb = createAsyncThunk('getFeatureFromDb/getFeatureSlice', async (userData) => {
    const url = `${process.env.REACT_APP_NODE_URL}/api/get-features`
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    return await Axios.get(url, config).then((response) => {
        return response.data
    })
})
const getFeatureSlice = createSlice({
    name: 'featuresState',
    initialState,
    reducers: {
        clearFeaturesState: (state) => {
            state.featuresState.isError = false;
            state.featuresState.isSuccess = false;
            state.featuresState.isFetching = false;
            state.featuresState.data = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(getFeatureFromDb.pending, state => {
            state.featuresState.isFetching = true;
        })
        builder.addCase(getFeatureFromDb.fulfilled, (state, action) => {
            state.featuresState.isFetching = false;
            state.featuresState.isSuccess = true;
            state.featuresState.data = action.payload;
        })
        builder.addCase(getFeatureFromDb.rejected, (state, action) => {
            state.featuresState.isFetching = false;
            state.featuresState.isError = true;
        })
    }
})
export const { clearFeaturesState } = getFeatureSlice.actions;
export default getFeatureSlice.reducer

