import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  editcategorySliceState: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    message: "",
  },
  editcategoryData: {
    data: null,
  },
};

// export const setEditemployeeData = async (data) => {
//     console.log('in setEditemployeeData ', data)
// }

export const editcategoryUpdateToDb = createAsyncThunk(
  "editcategoryUpdateToDb/editcategorySlice",
  async (categoryData) => {
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-category-edit/${categoryData.id}`;
    return await Axios.post(url, categoryData, config).then((response) => {
      return response.data;
    });
  }
);
const editcategorySlice = createSlice({
  name: "editcategorySliceState",
  initialState,

  reducers: {
    setEdicategoryData: (state, action) => {
      state.editcategoryData.data = action.payload;
    },
    clearEditcategoryState: (state) => {
      state.editcategorySliceState.isError = false;
      state.editcategorySliceState.isSuccess = false;
      state.editcategorySliceState.isFetching = false;
      state.editcategorySliceState.message = "";
      return state;
    },
    clearEditcategoryData: (state) => {
      state.editcategoryData.data = null;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editcategoryUpdateToDb.pending, (state) => {
      state.editcategorySliceState.isFetching = true;
    });
    builder.addCase(editcategoryUpdateToDb.fulfilled, (state, action) => {
      state.editcategorySliceState.isFetching = false;
      state.editcategorySliceState.isSuccess = true;
      state.editcategorySliceState.message = action.payload;
    });
    builder.addCase(editcategoryUpdateToDb.rejected, (state, action) => {
      state.editcategorySliceState.isFetching = false;
      state.editcategorySliceState.isError = true;
    });
  },
});
export const { clearEditcategoryState, setEdicategoryData, clearEditcategoryData } =
  editcategorySlice.actions;
export default editcategorySlice.reducer;
