import axios from 'axios';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

const initialState = {
  profile: {
    isSuccess: false,
    isError: false,
    isFetching: false,
    currentUserData: '',
  },
};

export const getProfileData = createAsyncThunk(
  'getProfileData/profileSlice',
  async () => {
    const url = `${API_URL}/api/users/profile-data`;
    console.log('get profileData', url);
    const token = await AsyncStorage.getItem('rbacToken');
    const config = {
      headers: {
        token: token ? token : '',
      },
    };
    console.log(config);
    const response = await axios.get(url, config);
    console.log(response.data, 'Profile>>>>>>>>>>>>>');
    return response.data;
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileDataSliceState: state => {
      state.profile.isError = false;
      state.profile.isSuccess = false;
      state.profile.isFetching = false;
      return state;
    },
    clearCurrentUserData: state => {
      state.profile.currentUserData = '';

      return state;
    },
  },
  extraReducers: builder => {
    builder.addCase(getProfileData.pending, state => {
      state.profile.isFetching = true;
    });
    builder.addCase(getProfileData.fulfilled, (state, action) => {
      state.profile.isFetching = false;
      state.profile.isSuccess = true;
      state.profile.currentUserData = action.payload;
    });
    builder.addCase(getProfileData.rejected, (state, action) => {
      state.profile.isFetching = false;
      state.profile.isError = true;
    });
  },
});
export const {clearProfileDataSliceState, clearCurrentUserData} =
  profileSlice.actions;
export default profileSlice.reducer;
