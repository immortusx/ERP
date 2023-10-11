import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  enquiryType: 'New',
};

const enquiryTypeSlice = createSlice({
  name: 'enquiryType',
  initialState,
  reducers: {
    setEnquiryType: (state, action) => {
      state.enquiryType = action.payload;
    },
  },
});

export const {setEnquiryType} = enquiryTypeSlice.actions;
export default enquiryTypeSlice.reducer;
