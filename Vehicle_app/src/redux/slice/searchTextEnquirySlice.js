import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  enquiries: [],
};

const enquiryTextSlice = createSlice({
  name: 'enquiries',
  initialState,
  reducers: {
    setEnquiryList(state, action) {
      state.enquiries = action.payload; // Set the enquiryList to the payload received
    },
    clearEnquiryList(state) {
      state.enquiries = []; // Clear the enquiryList
    },
  },
});

export const {setEnquiryList, clearEnquiryList} = enquiryTextSlice.actions;
export default enquiryTextSlice.reducer;
