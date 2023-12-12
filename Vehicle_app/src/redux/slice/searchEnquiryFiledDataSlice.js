import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  listdata: [],
};

const enquirySearchSlice = createSlice({
  name: 'listdata',
  initialState,
  reducers: {
    setEnquirySearchList(state, action) {
      state.listdata = action.payload; // Set the enquiryList to the payload received
    },
    clearEnquirySearchList(state) {
      state.listdata = []; // Clear the enquiryList
    },
  },
});

export const {setEnquirySearchList, clearEnquirySearchList} =
  enquirySearchSlice.actions;
export default enquirySearchSlice.reducer;
