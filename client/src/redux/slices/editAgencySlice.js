import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  editagencySliceState: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    message: "",
  },
  editagencyData: {
    data: null,
  },
};

// export const setEditemployeeData = async (data) => {
//     console.log('in setEditemployeeData ', data)
// }

export const editagencyUpdateToDb = createAsyncThunk(
  "editagencyUpdateToDb/editagencySlice",
  async (AgencyData) => {
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/agency/get-agency-edit`;
    return await Axios.post(url, AgencyData, config).then((response) => {
      console.log(response.data, "response.data");
      return response.data;
    });
  }
);
const editagencySlice = createSlice({
  name: "editagencySliceState",
  initialState,

  reducers: {
    setEditagencyData: (state, action) => {
      state.editagencyData.data = action.payload;
    },
    clearEditagencyState: (state) => {
      state.editagencySliceState.isError = false;
      state.editagencySliceState.isSuccess = false;
      state.editagencySliceState.isFetching = false;
      state.editagencySliceState.message = "";
      return state;
    },
    clearEditagencyData: (state) => {
      state.editagencyData.data = null;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editagencyUpdateToDb.pending, (state) => {
      state.editagencySliceState.isFetching = true;
    });
    builder.addCase(editagencyUpdateToDb.fulfilled, (state, action) => {
      state.editagencySliceState.isFetching = false;
      state.editagencySliceState.isSuccess = true;
      state.editagencySliceState.message = action.payload;
    });
    builder.addCase(editagencyUpdateToDb.rejected, (state, action) => {
      state.editagencySliceState.isFetching = false;
      state.editagencySliceState.isError = true;
    });
  },
});
export const {
  clearEditagencyState,
    setEditagencyData,
  clearEditagencyData,
} = editagencySlice.actions;
export default editagencySlice.reducer;
