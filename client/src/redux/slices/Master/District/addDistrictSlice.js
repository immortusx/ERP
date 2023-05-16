import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    addDistrict: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        message: '',
    },

}


export const addDistrictToDb = createAsyncThunk('addDistrictToDb/addDistrictSlice', async (districtData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    console.log('in addUserSlice', districtData)
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/add-district`
    return await Axios.post(url, districtData,config).then((response) => {
        return response.data
    })
})
const addDistrictSlice = createSlice({
    name: 'addDistrict',
    initialState,
    reducers: {
        clearaddDistrict: (state) => {
            state.addDistrict.isError = false;
            state.addDistrict.isSuccess = false;
            state.addDistrict.isFetching = false;
            state.addDistrict.message = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(addDistrictToDb.pending, state => {
            state.addDistrict.isFetching = true;
        })
        builder.addCase(addDistrictToDb.fulfilled, (state, action) => {
            state.addDistrict.isFetching = false;
            state.addDistrict.isSuccess = true;
            state.addDistrict.message = action.payload;
        })
        builder.addCase(addDistrictToDb.rejected, (state, action) => {
            state.addDistrict.isFetching = false;
            state.addDistrict.isError = true;
        })
    }
})
export const { clearaddDistrict } = addDistrictSlice.actions;
export default addDistrictSlice.reducer

