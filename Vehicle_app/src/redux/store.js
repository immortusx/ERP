import { configureStore } from "@reduxjs/toolkit";
import getLoginSlice from './slice/getUserLogin';
import enquirySlice from "./slice/addEnquirySlice";
import locationFormSlice from "./slice/locationFormSlice";
import manufacturerDetailsSlice from "./slice/manufacturerDetailsSlice";
import modalDataSlice from "./slice/modalDataSlice";
import getEnquirySlice from "./slice/getEnquirySlice";

export const store = configureStore({
    reducer: {
        getLoginSlice: getLoginSlice,
        enquirySlice: enquirySlice,
        locationForm: locationFormSlice,
        manufacturerDetails: manufacturerDetailsSlice,
        modalData: modalDataSlice,
        getEnquiryState: getEnquirySlice
    }
})