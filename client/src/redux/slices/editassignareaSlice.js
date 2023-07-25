import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  editassignareaSliceState: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    message: "",
  },
  editassignareaData: {
    data: null,
  },
};


export const editassignareaUpdateToDb = createAsyncThunk(
  "editassignareaUpdateToDb/editassignareaSlice",
  async (assignareaData) => {
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/edit-areaAssignUserById/${assignareaData.id}`;
    console.logg(url,"url")
    return await Axios.post(url, assignareaData, config).then((response) => {
      return response.data;
    });
  }
);
const editassignareaSlice = createSlice({
  name: "editassignareaSliceState",
  initialState,

  reducers: {
    setEdiassignareaData: (state, action) => {
      state.editassignareaData.data = action.payload;
    },
    clearEditassignareaState: (state) => {
      state.editassignareaSliceState.isError = false;
      state.editassignareaSliceState.isSuccess = false;
      state.editassignareaSliceState.isFetching = false;
      state.editassignareaSliceState.message = "";
      return state;
    },
    clearEditassignareaData: (state) => {
      state.editassignareaData.data = null;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editassignareaUpdateToDb.pending, (state) => {
      state.editassignareaSliceState.isFetching = true;
    });
    builder.addCase(editassignareaUpdateToDb.fulfilled, (state, action) => {
      state.editassignareaSliceState.isFetching = false;
      state.editassignareaSliceState.isSuccess = true;
      state.editassignareaSliceState.message = action.payload;
    });
    builder.addCase(editassignareaUpdateToDb.rejected, (state, action) => {
      state.editassignareaSliceState.isFetching = false;
      state.editassignareaSliceState.isError = true;
    });
  },
});
export const {
  clearEditassignareaState,
  setEdiassignareaData,
  clearEditassignareaData,
} = editassignareaSlice.actions;
export default editassignareaSlice.reducer;
