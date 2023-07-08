import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  addAgency: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    message: "",
  },
};

export const addAgencyToDb = createAsyncThunk(
  "addAgencyToDb/addAgencySlice",
  async (AgencyData) => {
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    console.log("in addUserSlice", AgencyData);
    const url = `${process.env.REACT_APP_NODE_URL}/api/agency/add-agency`;
    return await Axios.post(url, AgencyData, config).then((response) => {
      return response.data;
    });
  }
);
const addAgencySlice = createSlice({
  name: "addAgency",
  initialState,
  reducers: {
    clearaddaddAgency: (state) => {
      state.addAgency.isError = false;
      state.addAgency.isSuccess = false;
      state.addAgency.isFetching = false;
      state.addAgency.message = "";
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addAgencyToDb.pending, (state) => {
      state.addAgency.isFetching = true;
    });
    builder.addCase(addAgencyToDb.fulfilled, (state, action) => {
      state.addAgency.isFetching = false;
      state.addAgency.isSuccess = true;
      state.addAgency.message = action.payload;
    });
    builder.addCase(addAgencyToDb.rejected, (state, action) => {
      state.addAgency.isFetching = false;
      state.addAgency.isError = true;
    });
  },
});
export const { clearaddaddAgency } = addAgencySlice.actions;
export default addAgencySlice.reducer;
