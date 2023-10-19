import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  addHoliday: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    message: "",
  },
};

export const addHolidayToDb = createAsyncThunk(
  "addHolidayToDb/addHolidaySlice",
  async (holiday) => {
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    console.log("in addHolidaySlice", holiday);
    const url = `${process.env.REACT_APP_NODE_URL}/api/addholiday-data`;
    return await Axios.post(url, holiday, config).then((response) => {
      return response.data;
    });
  }
);
const addHolidaySlice = createSlice({
  name: "addHoliday",
  initialState,
  reducers: {
    clearaddHoliday: (state) => {
      state.addHoliday.isError = false;
      state.addHoliday.isSuccess = false;
      state.addHoliday.isFetching = false;
      state.addHoliday.message = "";
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addHolidayToDb.pending, (state) => {
      state.addHoliday.isFetching = true;
    });
    builder.addCase(addHolidayToDb.fulfilled, (state, action) => {
      state.addHoliday.isFetching = false;
      state.addHoliday.isSuccess = true;
      state.addHoliday.message = action.payload;
    });
    builder.addCase(addHolidayToDb.rejected, (state, action) => {
      state.addHoliday.isFetching = false;
      state.addHoliday.isError = true;
    });
  },
});
export const { clearaddHoliday } = addHolidaySlice.actions;
export default addHolidaySlice.reducer;
