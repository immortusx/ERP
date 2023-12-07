import {createSlice} from '@reduxjs/toolkit';

const enquiryTextSlice = createSlice({
  name: 'enquiries',
  initialState: {
    enquiryList: [], // Initial state for the enquiry list
  },
  reducers: {
    setEnquiryList(state, action) {
      state.enquiryList = action.payload; // Set the enquiryList to the payload received
    },
    clearEnquiryList(state) {
      state.enquiryList = []; // Clear the enquiryList
    },
  },
});

export const {setEnquiryList, clearEnquiryList} = enquiryTextSlice.actions;
export default enquiryTextSlice.reducer;
