import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  enquiryfollowupState: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    result: "",
  },
};

export const enquiryFollowUpDB = createAsyncThunk(
  "enquiryFollowUpDB/enquiryFollowupSave",
  async (data) => {
    console.log("enquiryFollowUpDB called data", data);
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/set-follow-up`;
    return await Axios.post(url, data, config).then((response) => {
      console.log("response.data", response.data);
      return response.data;
    });
  }
);
const enquiryFollowupSlice = createSlice({
  name: "enquiryfollowupState",
  initialState,
  reducers: {
    clearEnquiryFollowupState: (state) => {
      state.enquiryfollowupState.isError = false;
      state.enquiryfollowupState.isSuccess = false;
      state.enquiryfollowupState.isFetching = false;
      state.enquiryfollowupState.result = "";
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(enquiryFollowUpDB.pending, (state) => {
      state.enquiryfollowupState.isFetching = true;
    });
    builder.addCase(enquiryFollowUpDB.fulfilled, (state, action) => {
      state.enquiryfollowupState.isFetching = false;
      state.enquiryfollowupState.isSuccess = true;
      state.enquiryfollowupState.result = action.payload;
    });
    builder.addCase(enquiryFollowUpDB.rejected, (state, action) => {
      state.enquiryfollowupState.isFetching = false;
      state.enquiryfollowupState.isError = true;
    });
  },
});
export const { clearEnquiryFollowupState } = enquiryFollowupSlice.actions;
export default enquiryFollowupSlice.reducer;
