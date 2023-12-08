import { configureStore } from '@reduxjs/toolkit';
import getLoginSlice from './slice/getUserLogin';
import enquirySlice from './slice/addEnquirySlice';
import locationFormSlice from './slice/locationFormSlice';
import manufacturerDetailsSlice from './slice/manufacturerDetailsSlice';
import modalDataSlice from './slice/modalDataSlice';
import getEnquirySlice from './slice/getEnquirySlice';
import getAllVillageSlice from './slice/getAllVillageSlice';
import addFastEnquirySlice from './slice/addFastEnquirySlice';
import editEnquirySlice from './slice/editEnquirySlice';
import getUserProfile from './slice/getUserProfile';
import addFollowUpSlice from './slice/addFollowUpSlice';
import enquiryTypeSlice from './slice/enquiryTypeSlice';
import SwipeScreenSlice from './slice/SwipeScreenSlice';
import addEnquirySlice from './slice/addEnquirySlice';
import AgencyDataSlice from './slice/AgencyDataSlice';
import LanguageSlice from './slice/LanguageSlice';
import callLogsSlice from './slice/callLogsSlice';
import getUserTaskListSlice from './slice/getUserTaskListSlice';
import searchTextEnquirySlice from './slice/searchTextEnquirySlice';


export const store = configureStore({
  reducer: {
    getLoginSlice: getLoginSlice,
    enquirySlice: enquirySlice,
    locationForm: locationFormSlice,
    manufacturerDetails: manufacturerDetailsSlice,
    modalData: modalDataSlice,
    getVillageState: getAllVillageSlice,
    getEnquiryState: getEnquirySlice,
    fastEnquiry: addFastEnquirySlice,
    DetailEnquiry: addEnquirySlice,
    editEnquirySlice: editEnquirySlice,
    getUserProfileSlice: getUserProfile,
    followUpSlice: addFollowUpSlice,
    enquiryType: enquiryTypeSlice,
    swipe: SwipeScreenSlice,
    agencyData: AgencyDataSlice,
    language: LanguageSlice,
    callLog: callLogsSlice,
    getUserTaskListState: getUserTaskListSlice,
    enquiries: searchTextEnquirySlice
  },
});
