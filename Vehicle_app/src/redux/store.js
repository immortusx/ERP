import { configureStore } from "@reduxjs/toolkit";
import getLoginSlice from './slice/getUserLogin';
export const store = configureStore({
    reducer: {
        getLoginSlice: getLoginSlice
    }
})