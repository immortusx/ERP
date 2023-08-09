
import Axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    addassigneAreaState: {
        isSuccess: false,
        isError: false,
        isFetching: false,
        message: '',
    },

}

let counter = 0;

function generateUniqueId() {
  const currentTimestamp = new Date().getTime();
  const randomValue = Math.floor(Math.random() * 100000);
  const machineId = 35064;

  const combinedValue = currentTimestamp + randomValue + machineId + counter;

  const uniqueId = combinedValue % 100000;

  counter++;

  return uniqueId;
}
export const addassigneAreaToDb = createAsyncThunk('addassigneAreaToDb/addassigneAreaSlice', async (data) => {
    const uniqueId = generateUniqueId();
    data[0].group_id = uniqueId;
    console.log('in addassigneAreaSlice', data)
    const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/add-assigneArea`
    const config = {
        headers: {
            token: localStorage.getItem('rbacToken')
        },
    };
    return await Axios.post(url, data, config).then((response) => {
        return response.data
    })
})
const addassigneAreaSlice = createSlice({
    name: 'addassigneAreaState',
    initialState,
    reducers: {
        clearAddassigneAreaState: (state) => {
            state.addassigneAreaState.isError = false;
            state.addassigneAreaState.isSuccess = false;
            state.addassigneAreaState.isFetching = false;
            state.addassigneAreaState.message = '';
            return state;
        },
    },
    extraReducers: builder => {
        builder.addCase(addassigneAreaToDb.pending, state => {
            state.addassigneAreaState.isFetching = true;
        })
        builder.addCase(addassigneAreaToDb.fulfilled, (state, action) => {
            state.addassigneAreaState.isFetching = false;
            state.addassigneAreaState.isSuccess = true;
            state.addassigneAreaState.message = action.payload;
        })
        builder.addCase(addassigneAreaToDb.rejected, (state, action) => {
            state.addassigneAreaState.isFetching = false;
            state.addassigneAreaState.isError = true;
        })
    }
})
export const { clearAddassigneAreaState } = addassigneAreaSlice.actions;
export default addassigneAreaSlice.reducer

