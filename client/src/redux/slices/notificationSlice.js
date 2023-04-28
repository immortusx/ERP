
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: '',
}

const notificationSlice = createSlice({
    name: 'notificationSli',
    initialState,
    reducers: {
        setShowMessage: (state, action) => {
            state.message = action.payload
        }
    }
})

export const { setShowMessage } = notificationSlice.actions;
export default notificationSlice.reducer;

