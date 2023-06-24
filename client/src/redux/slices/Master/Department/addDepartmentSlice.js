import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  addDepartment: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    message: "",
  },
};

export const addDepartmentToDb = createAsyncThunk(
  "addDepartmentToDb/addDepartmentSlice",
  async (DepartmentData) => {
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    console.log("in addUserSlice", DepartmentData);
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/add-department`;
    return await Axios.post(url, DepartmentData, config).then((response) => {
      return response.data;
    });
  }
);
const addDepartmentSlice = createSlice({
  name: "addDepartment",
  initialState,
  reducers: {
    clearaddDepartment: (state) => {
      state.addDepartment.isError = false;
      state.addDepartment.isSuccess = false;
      state.addDepartment.isFetching = false;
      state.addDepartment.message = "";
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addDepartmentToDb.pending, (state) => {
      state.addDepartment.isFetching = true;
    });
    builder.addCase(addDepartmentToDb.fulfilled, (state, action) => {
      state.addDepartment.isFetching = false;
      state.addDepartment.isSuccess = true;
      state.addDepartment.message = action.payload;
    });
    builder.addCase(addDepartmentToDb.rejected, (state, action) => {
      state.addDepartment.isFetching = false;
      state.addDepartment.isError = true;
    });
  },
});
export const { clearaddDepartment } = addDepartmentSlice.actions;
export default addDepartmentSlice.reducer;
