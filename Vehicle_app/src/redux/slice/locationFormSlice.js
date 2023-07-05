import { createSlice } from '@reduxjs/toolkit';

const locationFormSlice = createSlice({
  name: 'locationForm',
  initialState: {
    state: '',
    district: '',
    taluka: '',
    village: '',
  },
  reducers: {
    saveLocationForm: (state, action) => {
      return action.payload;
    },
  },
});

export const { saveLocationForm } = locationFormSlice.actions;

export default locationFormSlice.reducer;