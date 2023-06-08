import { configureStore } from '@reduxjs/toolkit';

import getLoginSlice from './slice/getuserlogin';
import notificationSlice from './slice/notificationSlice'
import profileDataSlice from './slice/getuserProfile'
import setNewEnquiryDataSlice from './slice/setNewEnquiryDataSlice'
import enquirySlice from './slice/enquirySlice';


export const store = configureStore({
    reducer: {
        getLoginSlice: getLoginSlice,
        notificationState: notificationSlice,
        profileData: profileDataSlice,
        setNewEnquiryDataState: setNewEnquiryDataSlice,
        enquiryState: enquirySlice,
    }
})  