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
import enquirySlice from './slices/enquirySlice'
import enquiryFieldSaveSlice from './slices/enquiryFieldSaveSlice'
import categoryAddSlice from './slices/categoryAddSlice'
import setNewEnquiryDataSlice from './slices/setNewEnquiryDataSlice'


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
        enquiryState: enquirySlice,
        editRoleDataState: editRoleDataSlice,
        enquiryFieldSaveState: enquiryFieldSaveSlice,
        categoryAddState: categoryAddSlice,
        setNewEnquiryDataState: setNewEnquiryDataSlice,
    }
})  