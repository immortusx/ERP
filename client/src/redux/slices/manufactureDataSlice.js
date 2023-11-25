import { createSlice } from '@reduxjs/toolkit';
const manufactureModalSlice = createSlice({
  name: 'manufactureModal',
  initialState: {
    manufacturerId: null,
    manufacturerName: '',
    manufacturerDescription: '',
    isActive: null,
    rowNumber: null,
  },
  reducers: {
    setManufactureData: (state, action) => {
      const {
        manufacturerId,
        manufacturerName,
        manufacturerDescription,
        isActive,
        rowNumber,
      } = action.payload;
      return {
        ...state,
        manufacturerId,
        manufacturerName,
        manufacturerDescription,
        isActive,
        rowNumber,
      };
    },
    clearManufactureData: (state) => {
      return {
        manufacturerId: null,
        manufacturerName: '',
        manufacturerDescription: '',
        isActive: null,
        rowNumber: null,
      };
    },
  },
});
export const { setManufactureData, clearManufactureData } = manufactureModalSlice.actions;
export default manufactureModalSlice.reducer;