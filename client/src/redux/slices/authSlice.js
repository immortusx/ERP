
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tokkenState: '',
    adminState: false,

}

const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        clearAuthSliceState: (state) => {
            state.tokkenState = '';
            state.adminState = false;

        },
        setTokkenSlice: (state, action) => {
            state.tokkenState = action.payload;
        },
        adminIsSet: (state, action) => {
            state.adminState = action.payload;
        }
    }
})

export const { setTokkenSlice, adminIsSet, clearAuthSliceState } = authSlice.actions;
export default authSlice.reducer;

