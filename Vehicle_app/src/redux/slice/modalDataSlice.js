import { createSlice } from '@reduxjs/toolkit';

const modalDataSlice = createSlice({
  name: 'modalData',
  initialState: {
    maker: '',
    modalName: '',
    variantName: '',
    year: '',
    condition_of: ''
  },
  reducers: {
    saveModalData: (state, action) => {
      const { maker, modalName, variantName, year, condition_of } = action.payload;
      state.maker = maker;
      state.modalName = modalName;
      state.variantName = variantName;
      state.year = year;
      state.condition_of = condition_of;
    },
  },
});

export const { saveModalData } = modalDataSlice.actions;

export default modalDataSlice.reducer;