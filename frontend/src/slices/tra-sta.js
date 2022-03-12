import transitionApi from '../api/transitionApi'
import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: false,
  hasErrors: false,
  transitionstatuss: [],
  transitionUpdate: {},
}
const transitionstatussSlice = createSlice({
  name: 'transitionstatuss',
  initialState,
  reducers: {
    addStatusToTransition: (state, action) => {
      state.transitionstatuss.unshift(action.payload)
    },
    startLoading: (state) => {
      state.loading = true
    },
    getTransitionsStatussSuccess: (state, action) => {
      state.transitionstatuss = action.payload
      state.loading = false
      state.hasErrors = false
    },
    getTransitionStatussFailure: (state) => {
      state.loading = false
      //handling Errors
      state.hasErrors = true
    },
    removeStatus: (state, action) => {
      let filteredStatus = state.transitionstatuss.filter(
        (transitionstatuss) => transitionstatuss.StatusKey !== action.payload
      )
      state.transitionstatuss = filteredStatus
    },
  },
})

const {
  addStatusToTransition,
  startLoading,
  removeStatus,
  getTransitionsStatussSuccess,
  getTransitionStatussFailure,
} = transitionstatussSlice.actions

const { actions } = transitionstatussSlice
export const transitionStatussSelector = (state) => state.transitionstatuss

const transitionStatussReducer = transitionstatussSlice.reducer
export default transitionStatussReducer
//
export const fetchTransitionStatuss = (id) => async (dispatch) => {
  dispatch(startLoading())
  
  transitionApi
    .getTransitionStatus(id)
    .then((res) => {
      console.log(res)
      if(!res.Data) dispatch(getTransitionsStatussSuccess([]))
      if (res.Data) dispatch(getTransitionsStatussSuccess(res.Data))
    })
    .catch((err) => {
      dispatch(getTransitionStatussFailure())
      return err
    })
}
//add status
export const AddStatusToTransition = (data) => async(dispatch)=>{
  transitionApi
  .addStatusToTransition(data)
  .then((res)=>{
    dispatch(addStatusToTransition(data))
    return res
  }).catch((err)=>{
    alert(err.response.data.Msg)
      dispatch(getTransitionStatussFailure())
  })
}
export const deleteStatusInTransition =(idtransition, idstatus) => async (dispatch) => {
    transitionApi
      .deleteStatusInTransition(idtransition, idstatus)
      .then((res) => {
        console.log(res)
        dispatch(removeStatus(idstatus))
      })
      .catch((err) => {
        console.log(err)
      })
  }
