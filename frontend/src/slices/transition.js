import { createSlice } from '@reduxjs/toolkit'
import transitionApi from '../api/transitionApi'


export const initialState = {
  loading: false,
  hasErrors: false,
  transitions: [],
  transitionUpdate: {},
}

//slice
const transitionsSlice = createSlice({
  name: 'transitions',
  initialState,
  reducers: {
    addTransition: (state, action) => {
      state.transitions.unshift(action.payload)
    },
    removeTransition: (state, action) => {
      let filteredTransition = state.transitions.filter(
        (transition) => transition.TransitionId !== action.payload
      )
      state.transitions = filteredTransition
    },
    getByIdWorkflow: (state, action) =>{
      state.transitions = action.payload
      state.loading = false
      state.hasErrors = false
    },
    startLoading: (state) => {        
        state.loading = true
      },
    getTransitionSuccess:(state, action) =>{
        state.transitions = action.payload
        state.loading = false
        state.hasErrors = false
    },
    getTransitionFailure:(state)=>{
        state.loading = false
        state.hasErrors = true
    },
    setTransitionUpdate:(state,action) =>{
      console.log(state)
      state.transitionUpdate = action.payload
    },
    updateTransition:(state,action) =>{
        const {id,data} = action.payload
        let newTransitions = state.transitions.map(
            (
                transition => (transition.TransitionId === id ? {TransitionId: id, ...data} : transition)
            ))
        state.transitions = newTransitions

    }
  },
})

const {addTransition, getTransitionSuccess,startLoading,getTransitionFailure,removeTransition, getByIdStepname} =
transitionsSlice.actions

const {actions} = transitionsSlice

//export transition
export const transitionsSelector = (state) => state.transitions
export const transitionsUpdateSelector = (state) => state.transitionUpdate

// export The reducer
const transitionReducer = transitionsSlice.reducer
export default transitionReducer
//Actions
export const fetchTransitions = () => async(dispatch) =>{
    dispatch(startLoading())
    transitionApi
    .getAllTransition()
    .then((res)=>{
        if(res.Data) {
            dispatch(getTransitionSuccess(res.Data))
        }
        return(res)

    })
    .catch((err)=>{
      dispatch(getTransitionFailure())
      return(err)
    })

}
//create transition 
export const createTransition = (Transition) => async(dispatch) =>{
    console.log(Transition)
    transitionApi
    .createTransition(Transition)
    .then((res)=>{
      dispatch(addTransition(Transition))
      return res
    }).catch((err)=>{
      // alert(err.response.data.Msg)
      alert(err.response.data.Msg)
      dispatch(getTransitionFailure())
    })
  
}
export const deleteTransition = (id) => async(dispatch) =>{
  transitionApi
  .delete(id)
  .then((res)=>{
    dispatch(removeTransition(id))
    console.log(res)
  })
  .catch((err)=>{
    dispatch(getTransitionFailure())
    return(err)
  })
}

export const setTransitionUpdate = (transition) => async(dispatch) =>{
  try {
    console.log("=====")
    console.log(transition)
    dispatch(actions.setTransitionUpdate(transition))
  } catch (error) {
    dispatch(getTransitionFailure())

  }
}

export const updateTransition = (transition) => async(dispatch) =>{
  transitionApi
  .updateTransition(transition)
  .then((res)=>{
    dispatch(actions.updateTransition(transition))
    return res
  })
  .catch((err)=>{
    dispatch(getTransitionFailure())
    return err
  })
}
export const getDataByIdWorkflow = (id) => async(dispatch) =>{
  console.log(id)  
  transitionApi
    .getDataByIdWorkflow(id)
    .then((res)=>{
      console.log(res)
      dispatch(getTransitionSuccess(res.Data))
      console.log(res)
    })
    .catch((err)=>{
      dispatch(getTransitionFailure())
      return(err)
    })
  }