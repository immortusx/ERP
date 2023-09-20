import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  editEnquiryState: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    result: "",
  },
};

export const editEnquiryDb = createAsyncThunk(
  "editEditEnquiryDb/editEnquirySlice",
  async (editData) => {
    try {
      const customerId = editData.customerId;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
      const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/set-edit-enquiry-data/${customerId}`;

      const response = await axios.post(url, editData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const editEnquirySlice = createSlice({
  name: "editEnquiryState",
  initialState,
  reducers: {
    clearEditEnquiryState: (state) => {
      state.editEnquiryState.isFetching = false;
      state.editEnquiryState.isSuccess = false;
      state.editEnquiryState.isError = false;
      state.editEnquiryState.result = "";
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editEnquiryDb.pending, (state) => {
      state.editEnquiryState.isFetching = true;
    });
    builder.addCase(editEnquiryDb.fulfilled, (state, action) => {
      state.editEnquiryState.isFetching = false;
      state.editEnquiryState.isSuccess = true;
      state.editEnquiryState.result = action.payload;
    });
    builder.addCase(editEnquiryDb.rejected, (state) => {
      state.editEnquiryState.isError = true;
      state.editEnquiryState.isFetching = false;
    });
  },
});

export const { clearEditEnquiryState } = editEnquirySlice.actions;
export default editEnquirySlice.reducer;
