import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  featuresState: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    data: "",
  },
};

export const getCategoryFeatureFromDb = createAsyncThunk(
  "getFeatureCategoryFromDb/getCategoryFeatureSlice",
  async (userData) => {
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-category-features`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    return await Axios.get(url, config).then((response) => {
      return response.data;
    });
  }
);
const getFeatureSlice = createSlice({
  name: "featuresState",
  initialState,
  reducers: {
    clearFeaturesState: (state) => {
      state.featuresState.isError = false;
      state.featuresState.isSuccess = false;
      state.featuresState.isFetching = false;
      state.featuresState.data = "";
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCategoryFeatureFromDb.pending, (state) => {
      state.featuresState.isFetching = true;
    });
    builder.addCase(getCategoryFeatureFromDb.fulfilled, (state, action) => {
      state.featuresState.isFetching = false;
      state.featuresState.isSuccess = true;
      state.featuresState.data = action.payload;
    });
    builder.addCase(getCategoryFeatureFromDb.rejected, (state, action) => {
      state.featuresState.isFetching = false;
      state.featuresState.isError = true;
    });
  },
});
export const { clearFeaturesState } = getFeatureSlice.actions;
export default getFeatureSlice.reducer;
