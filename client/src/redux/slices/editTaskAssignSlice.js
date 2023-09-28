import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  editTaskAssignSliceState: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    message: "",
  },
  editTaskAssignData: {
    data: null,
  },
};

export const editTaskAssignUpdateToDb = createAsyncThunk(
  "editTaskAssignUpdateToDb/editTaskAssignSlice",
  async (data) => {
    const EmployeeId = data.eIds;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    const url = `${process.env.REACT_APP_NODE_URL}/api/set-task-edit/${EmployeeId}`;
    return await Axios.post(url, data, config).then((response) => {
      return response.data;
    });
  }
);
const editTaskAssignSlice = createSlice({
  name: "editTaskAssignSliceState",
  initialState,

  reducers: {
    setEditTaskAssignData: (state, action) => {
      state.editTaskAssignData.data = action.payload;
    },
    clearEditTaskAssignState: (state) => {
      state.editTaskAssignSliceState.isError = false;
      state.editTaskAssignSliceState.isSuccess = false;
      state.editTaskAssignSliceState.isFetching = false;
      state.editTaskAssignSliceState.message = "";
      return state;
    },
    clearEditTaskAssignData: (state) => {
      state.editTaskAssignData.data = null;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editTaskAssignUpdateToDb.pending, (state) => {
      state.editTaskAssignSliceState.isFetching = true;
    });
    builder.addCase(editTaskAssignUpdateToDb.fulfilled, (state, action) => {
      state.editTaskAssignSliceState.isFetching = false;
      state.editTaskAssignSliceState.isSuccess = true;
      state.editTaskAssignSliceState.message = action.payload;
    });
    builder.addCase(editTaskAssignUpdateToDb.rejected, (state, action) => {
      state.editTaskAssignSliceState.isFetching = false;
      state.editTaskAssignSliceState.isError = true;
    });
  },
});
export const {
  clearEditTaskAssignState,
  setEditTaskAssignData,
  clearEditTaskAssignData,
} = editTaskAssignSlice.actions;
export default editTaskAssignSlice.reducer;
