import { configureStore } from '@reduxjs/toolkit';
import getRegisterSlice from './slices/getRegisterSlice'
import getLoginSlice from './slices/getLoginSlice'
import addUserSlice from './slices/addUserSlice'
import getUserListSlice from './slices/getUserListSlice'

import profileDataSlice from './slices/profileSlice'
import setTokkenSlice from './slices/authSlice'
import AdminSlice from './slices/adminSlice'
import getFeatureSlice from './slices/getFeatureSlice'
import addRoleSlice from './slices/addRoleSlice'
import notificationSlice from './slices/notificationSlice'

import editUserDataSlice from './slices/editUserDataSlice'
import editRoleDataSlice from './slices/editRoleDataSlice'
import inquirySlice from './slices/inquirySlice'
import inquiryFieldSaveSlice from './slices/inquiryFieldSaveSlice'
import categoryAddSlice from './slices/categoryAddSlice'
import setNewInquiryDataSlice from './slices/setNewInquiryDataSlice'


export const store = configureStore({
    reducer: {
        setTokkenSlice: setTokkenSlice,
        getRegisterSlice: getRegisterSlice,
        getLoginSlice: getLoginSlice,
        AdminSlice: AdminSlice,
        profileData: profileDataSlice,
        addUserSlice: addUserSlice,
        getUserListSlice: getUserListSlice,
        featuresListState: getFeatureSlice,
        addRoleState: addRoleSlice,
        notificationState: notificationSlice,
        editUserDataState: editUserDataSlice,
        inquiryState: inquirySlice,
        editRoleDataState: editRoleDataSlice,
        inquiryFieldSaveState: inquiryFieldSaveSlice,
        categoryAddState: categoryAddSlice,
        setNewInquiryDataState: setNewInquiryDataSlice,
    }
})  