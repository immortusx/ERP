import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    addVillage: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        message: '',
    },

}


export const addVillageToDb = createAsyncThunk('addVillageToDb/addVillageSlice', async (VillageData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    console.log('in addUserSlice', VillageData)
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/add-Village`
    return await Axios.post(url, VillageData,config).then((response) => {
        return response.data
    })
})
const addVillageSlice = createSlice({
    name: 'addVillage',
    initialState,
    reducers: {
        clearaddVillage: (state) => {
            state.addVillage.isError = false;
            state.addVillage.isSuccess = false;
            state.addVillage.isFetching = false;
            state.addVillage.message = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(addVillageToDb.pending, state => {
            state.addVillage.isFetching = true;
        })
        builder.addCase(addVillageToDb.fulfilled, (state, action) => {
            state.addVillage.isFetching = false;
            state.addVillage.isSuccess = true;
            state.addVillage.message = action.payload;
        })
        builder.addCase(addVillageToDb.rejected, (state, action) => {
            state.addVillage.isFetching = false;
            state.addVillage.isError = true;
        })
    }
})
export const { clearaddVillage } = addVillageSlice.actions;
export default addVillageSlice.reducer

