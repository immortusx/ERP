import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  addCategory: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    message: "",
  },
};

export const addCategoryToDb = createAsyncThunk(
  "addCategoryToDb/addCategorySlice",
  async (CategoryData) => {
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    console.log("in addUserSlice", CategoryData);
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/add-category`;
    return await Axios.post(url, CategoryData, config).then((response) => {
      return response.data;
    });
  }
);
const addCategorySlice = createSlice({
  name: "addCategory",
  initialState,
  reducers: {
    clearaddCategory: (state) => {
      state.addCategory.isError = false;
      state.addCategory.isSuccess = false;
      state.addCategory.isFetching = false;
      state.addCategory.message = "";
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addCategoryToDb.pending, (state) => {
      state.addCategory.isFetching = true;
    });
    builder.addCase(addCategoryToDb.fulfilled, (state, action) => {
      state.addCategory.isFetching = false;
      state.addCategory.isSuccess = true;
      state.addCategory.message = action.payload;
    });
    builder.addCase(addCategoryToDb.rejected, (state, action) => {
      state.addCategory.isFetching = false;
      state.addCategory.isError = true;
    });
  },
});
export const { clearaddCategory } = addCategorySlice.actions;
export default addCategorySlice.reducer;
