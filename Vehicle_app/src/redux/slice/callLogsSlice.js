import { createSlice } from '@reduxjs/toolkit';

export const callLogSlice = createSlice({
  name: 'callLog',
  initialState: {
    logs: [],
    permissionStatus: null,
    callDuration: null,
  },
  reducers: {
    setLogs: (state, action) => {
      state.logs = action.payload;
    },
    setPermissionStatus: (state, action) => {
      state.permissionStatus = action.payload;
    },
    setCallDuration: (state, action) => {
      console.log('New callDuration:', action.payload);
      state.callDuration = action.payload;
    },
  },
});

export const { setLogs, setPermissionStatus, setCallDuration } = callLogSlice.actions;
export default callLogSlice.reducer;
