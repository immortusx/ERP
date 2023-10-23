import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  editHoliday: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    message: "",
  },
};

export const editHolidayToDb = createAsyncThunk(
  "editHolidayToDb/editHolidaySlice",
  async (holiday) => {
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    console.log("in editHolidaySlice", holiday.id);
    const url = `${process.env.REACT_APP_NODE_URL}/api/update-holidayStatus`;
    return await Axios.post(url, holiday, config).then((response) => {
      return response.data;
    });
  }
);
const editHolidaySlice = createSlice({
  name: "editHoliday",
  initialState,
  reducers: {
    cleareditHoliday: (state) => {
      state.editHoliday.isError = false;
      state.editHoliday.isSuccess = false;
      state.editHoliday.isFetching = false;
      state.editHoliday.message = "";
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editHolidayToDb.pending, (state) => {
      state.editHoliday.isFetching = true;
    });
    builder.addCase(editHolidayToDb.fulfilled, (state, action) => {
      state.editHoliday.isFetching = false;
      state.editHoliday.isSuccess = true;
      state.editHoliday.message = action.payload;
    });
    builder.addCase(editHolidayToDb.rejected, (state, action) => {
      state.editHoliday.isFetching = false;
      state.editHoliday.isError = true;
    });
  },
});
export const { cleareditHoliday } = editHolidaySlice.actions;
export default editHolidaySlice.reducer;
