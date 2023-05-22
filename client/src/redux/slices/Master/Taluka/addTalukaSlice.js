import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    addTaluka: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        message: '',
    },

}


export const addTalukaToDb = createAsyncThunk('addTalukaToDb/addTalukaSlice', async (TalukaData) => {
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        }
    };
    console.log('in addUserSlice', TalukaData)
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/add-Taluka`
    return await Axios.post(url, TalukaData,config).then((response) => {
        return response.data
    })
})
const addTalukaSlice = createSlice({
    name: 'addTaluka',
    initialState,
    reducers: {
        clearaddTaluka: (state) => {
            state.addTaluka.isError = false;
            state.addTaluka.isSuccess = false;
            state.addTaluka.isFetching = false;
            state.addTaluka.message = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(addTalukaToDb.pending, state => {
            state.addTaluka.isFetching = true;
        })
        builder.addCase(addTalukaToDb.fulfilled, (state, action) => {
            state.addTaluka.isFetching = false;
            state.addTaluka.isSuccess = true;
            state.addTaluka.message = action.payload;
        })
        builder.addCase(addTalukaToDb.rejected, (state, action) => {
            state.addTaluka.isFetching = false;
            state.addTaluka.isError = true;
        })
    }
})
export const { clearaddTaluka } = addTalukaSlice.actions;
export default addTalukaSlice.reducer

