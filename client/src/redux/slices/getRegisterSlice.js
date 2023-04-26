import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  registerState: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    message: false,
  },

}

export const getRegisterAdmin = createAsyncThunk('getRegisterAdmin/getRegisterSlice', async (data) => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/login/admin-registration`
  return await Axios.post(url, data).then((response) => {
    return response.data
  }
  )
})
const getRegisterSlice = createSlice({
  name: 'registerState',
  initialState,
  reducers: {
    clearRegisterState: (state) => {
      state.registerState.isError = false;
      state.registerState.isSuccess = false;
      state.registerState.isFetching = false;
      state.registerState.message = '';
      return state;
    },
  },
  extraReducers: builder => {
    builder.addCase(getRegisterAdmin.pending, state => {
      state.registerState.isFetching = true;
    })
    builder.addCase(getRegisterAdmin.fulfilled, (state, action) => {
      state.registerState.isFetching = false;
      state.registerState.isSuccess = true;
      state.registerState.message = action.payload;
    })
    builder.addCase(getRegisterAdmin.rejected, (state, action) => {
      state.registerState.isFetching = false;
      state.registerState.isError = true;
    })
  }
})
export const { clearRegisterState } = getRegisterSlice.actions;
export default getRegisterSlice.reducer

