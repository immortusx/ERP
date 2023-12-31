import { configureStore } from '@reduxjs/toolkit';
import getRegisterSlice from './slices/getRegisterSlice'
import getLoginSlice from './slices/getLoginSlice'
import addUserSlice from './slices/addUserSlice'
import addemployeeSlice from './slices/addemployeeSlice'
import getUserListSlice from './slices/getUserListSlice'
import getemployeeListSlice from './slices/getemployeeListSlice'
import holidaySlice from './slices/Master/Holiday/holidaySlice';
import profileDataSlice from './slices/profileSlice'
import AdminSlice from './slices/adminSlice'
import getFeatureSlice from './slices/getFeatureSlice'
import getcategoryfeactureSice from './slices/getcategoryfeactureSice';
import addRoleSlice from './slices/addRoleSlice'
import notificationSlice from './slices/notificationSlice'
import addDepartmentSlice from './slices/Master/Department/addDepartmentSlice';
import addCategorySlice from './slices/Master/Category/addCategorySlice';
import addagencySlice from './slices/addagencySlice';
import editUserDataSlice from './slices/editUserDataSlice'
import editemployeeDataSlice from './slices/editemployeeDataSlice'
import editDepartmentSlice from './slices/Master/Department/editDepartmentSlice';
import editAgencySlice from './slices/editAgencySlice';
import editRoleDataSlice from './slices/editRoleDataSlice'
import enquirySlice from './slices/enquirySlice'
import enquiryFieldSaveSlice from './slices/enquiryFieldSaveSlice'
import categoryAddSlice from './slices/categoryAddSlice'
import setNewEnquiryDataSlice from './slices/setNewEnquiryDataSlice'
import tokenBranchChangeSlice from './slices/tokenBranchChangeSlice'
import addStateSlice from './slices/Master/State/addStateSlice';
import addDistrictSlice from './slices/Master/District/addDistrictSlice';
import addTalukaSlice from './slices/Master/Taluka/addTalukaSlice';
import addVillageSlice from './slices/Master/Village/addVillageSlice';
import addManufacturerSlice from './slices/Master/Manufacturer/addManufacturerSlice';
import addassigneAreaSlice from './slices/assignedAreaSlice'
import editCategorySlice from './slices/Master/Category/editCategorySlice';
import editassignareaSlice from './slices/editassignareaSlice';
import addTaskSlice from './slices/addTaskSlice';
import editEnquirySlice from './slices/editEnquirySlice';
import followupSlice from './slices/followupSlice';
import addEnquirySourcesSlice from './slices/Master/EnquirySources/addEnquirySourcesSlice';
import editTaskAssignSlice from './slices/editTaskAssignSlice';
import gettaskAssignListSlice from './slices/gettaskAssignListSlice';
import languageReducer from './slices/languageSlice'
import editholidaySlice from './slices/Master/Holiday/editholidaySlice';
import manufactureDataSlice from './slices/manufactureDataSlice';

export const store = configureStore({
  reducer: {
    getRegisterSlice: getRegisterSlice,
    getLoginSlice: getLoginSlice,
    AdminSlice: AdminSlice,
    profileData: profileDataSlice,
    addUserSlice: addUserSlice,
    addemployeeSlice: addemployeeSlice,
    getUserListSlice: getUserListSlice,
    getemployeeListSlice: getemployeeListSlice,
    featuresListState: getFeatureSlice,
    categoryfeaturesListState: getcategoryfeactureSice,
    addRoleState: addRoleSlice,
    notificationState: notificationSlice,
    editUserDataState: editUserDataSlice,
    editemployeeDataState: editemployeeDataSlice,
    addAgency: addagencySlice,
    editDepartmentDataState: editDepartmentSlice,
    editCategoryDataState: editCategorySlice,
    editassignareaDataState: editassignareaSlice,
    editAgencyDataState: editAgencySlice,
    enquiryState: enquirySlice,
    editRoleDataState: editRoleDataSlice,
    enquiryFieldSaveState: enquiryFieldSaveSlice,
    categoryAddState: categoryAddSlice,
    setNewEnquiryDataState: setNewEnquiryDataSlice,
    tokenBranchChangeState: tokenBranchChangeSlice,
    addStateSlice: addStateSlice,
    addDistrictSlice: addDistrictSlice,
    addTalukaSlice: addTalukaSlice,
    addDepartment: addDepartmentSlice,
    addCategory: addCategorySlice,
    addVillageSlice: addVillageSlice,
    addManufacturerSlice: addManufacturerSlice,
    addassigneAreaSlice: addassigneAreaSlice,
    addTaskSlice: addTaskSlice,
    editEnquiryState: editEnquirySlice,
    addEnquirySourcesSlice: addEnquirySourcesSlice,
    enquiryFollowupSlice: followupSlice,
    editTaskAssignSlice: editTaskAssignSlice,
    gettaskAssignListSlice: gettaskAssignListSlice,
    language: languageReducer,
    holidayState: holidaySlice,
    editholidaySlice: editholidaySlice,
    manufactureModal:manufactureDataSlice
  },
});  