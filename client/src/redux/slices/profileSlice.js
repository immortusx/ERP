import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    profile: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        currentUserData: '',

    },

}

export const getProfileData = createAsyncThunk('profileSlice', async (token) => {
    const config = {
        headers: {
            token: token
        }
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/users/profile-data`
    return await Axios.get(url, config).then((response) => {
        return response.data
    })
})
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfileDataSliceState: (state) => {
            state.profile.isError = false;
            state.profile.isSuccess = false;
            state.profile.isFetching = false;
            return state;
        },
        clearCurrentUserData: (state) => {
            state.profile.currentUserData = '';

            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(getProfileData.pending, state => {
            state.profile.isFetching = true;
        })
        builder.addCase(getProfileData.fulfilled, (state, action) => {
            state.profile.isFetching = false;
            state.profile.isSuccess = true;
            state.profile.currentUserData = action.payload;
        })
        builder.addCase(getProfileData.rejected, (state, action) => {
            state.profile.isFetching = false;
            state.profile.isError = true;
        })
    }
})
export const { clearProfileDataSliceState, clearCurrentUserData } = profileSlice.actions;
export default profileSlice.reducer

