import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  enquiryType: 'New',
  enquiryFilter: 'Temporal',
};

const enquiryTypeSlice = createSlice({
  name: 'enquiryType',
  initialState,
  reducers: {
    setEnquiryType: (state, action) => {
      state.enquiryType = action.payload;
    },
    setEnquiryFilter: (state, action) => {
      state.enquiryFilter = action.payload;
    },
  },
});

export const {setEnquiryType, setEnquiryFilter} = enquiryTypeSlice.actions;
export default enquiryTypeSlice.reducer;
