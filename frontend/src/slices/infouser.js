import { createSlice } from '@reduxjs/toolkit'
import userApi from '../api/userApi'

export const initialState = {
  inforUser: {},
  loading: false,
  success: false,
  hasErrors: false,
  errorMessage: '',
}
const inforUserSlice = createSlice({
  name: 'inforUser',
  initialState,
  reducers: {
    clearState: (state, action) => {
      state.loading = false
      state.success = false
      state.hasErrors = false
      state.inforUser = action.payload
    },
    getMeSuccess: (state, action) => {
      state.loading = false
      state.success = true
      state.inforUser = action.payload
    },
    startLoading: (state) => {
      state.loading = true
    },
    getMeFailure: (state, action) => {
      state.loading = false
      state.hasErrors = true
      state.errorMessage = action.payload
    },
  
   
  },
})

const {getMeSuccess, getMeFailure, clearState } =
  inforUserSlice.actions

export const inforUserSelector = (state) => state.inforuser
const userReducer = inforUserSlice.reducer
export default userReducer

export const getMe = () => async (dispatch) => {
  //dispatch(startloignLoading())
  userApi.infoUserByToken()
    .then( (response) => {
        dispatch(getMeSuccess(response.Data))
    })
    .catch((err) => {
      dispatch(getMeFailure())
    })
}

export const logout = () => async(dispatch) =>{
   dispatch(clearState({}))
}
