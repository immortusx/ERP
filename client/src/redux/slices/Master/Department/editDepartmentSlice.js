import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  editdepartmentSliceState: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    message: "",
  },
  editdepartmentData: {
    data: null,
  },
};

export const editdepartmentUpdateToDb = createAsyncThunk(
  "editdepartmentUpdateToDb/editdepartmentSlice",
  async (departmentData) => {
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-department-edit/${departmentData.id}`;
    return await Axios.post(url, departmentData, config).then((response) => {
      return response.data;
    });
  }
);
const editdepartmentSlice = createSlice({
  name: "editdepartmentSliceState",
  initialState,

  reducers: {
    setEditdepartmentData: (state, action) => {
      state.editdepartmentData.data = action.payload;
    },
    clearEditdepartmentState: (state) => {
      state.editdepartmentSliceState.isError = false;
      state.editdepartmentSliceState.isSuccess = false;
      state.editdepartmentSliceState.isFetching = false;
      state.editdepartmentSliceState.message = "";
      return state;
    },
    clearEditdepartmentData: (state) => {
      state.editdepartmentData.data = null;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editdepartmentUpdateToDb.pending, (state) => {
      state.editdepartmentSliceState.isFetching = true;
    });
    builder.addCase(editdepartmentUpdateToDb.fulfilled, (state, action) => {
      state.editdepartmentSliceState.isFetching = false;
      state.editdepartmentSliceState.isSuccess = true;
      state.editdepartmentSliceState.message = action.payload;
    });
    builder.addCase(editdepartmentUpdateToDb.rejected, (state, action) => {
      state.editdepartmentSliceState.isFetching = false;
      state.editdepartmentSliceState.isError = true;
    });
  },
});
export const {
  clearEditdepartmentState,
  setEditdepartmentData,
  clearEditdepartmentData,
} = editdepartmentSlice.actions;
export default editdepartmentSlice.reducer;
